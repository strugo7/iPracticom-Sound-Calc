import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { ChainNode, ValidationResult } from '../types/catalog';
import { validateChain } from '../engine/validator';
import catalogData from '../data/catalog.json';
import { Catalog } from '../types/catalog';

// מאחסן טופולוגיה של שרשרת אות בMMKV
// כולל הרשמת אוטומטית לולידציה על כל שינוי בשרשרת

interface TopologyState {
  chain: ChainNode[];
  validationResult: ValidationResult | null;

  // פעולות
  addNode: (node: ChainNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<ChainNode>) => void;
  setValidationResult: (result: ValidationResult | null) => void;
  resetChain: () => void;
}

// Simple async storage that uses a fallback (in-memory for now)
// In production, replace with AsyncStorage or react-native-mmkv
const createAsyncStorage = () => {
  let store: Record<string, any> = {};
  return {
    getItem: async (name: string) => {
      return store[name] || null;
    },
    setItem: async (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: async (name: string) => {
      delete store[name];
    },
  };
};

const asyncStorage = createAsyncStorage();

// ולידציה אוטומטית — מריצה בדיקה על כל שינוי בשרשרת
const runValidation = (chain: ChainNode[]): ValidationResult | null => {
  if (chain.length === 0) {
    return null;
  }
  const catalog = catalogData as Catalog;
  return validateChain(chain, catalog);
};

export const useTopologyStore = create<TopologyState>()(
  persist(
    (set) => ({
      chain: [],
      validationResult: null,

      addNode: (node) =>
        set((state) => {
          const newChain = [...state.chain, node];
          return {
            chain: newChain,
            validationResult: runValidation(newChain),
          };
        }),

      removeNode: (nodeId) =>
        set((state) => {
          const newChain = state.chain.filter((n) => n.id !== nodeId);
          return {
            chain: newChain,
            validationResult: runValidation(newChain),
          };
        }),

      updateNode: (nodeId, updates) =>
        set((state) => {
          const newChain = state.chain.map((n) =>
            n.id === nodeId ? { ...n, ...updates } : n
          );
          return {
            chain: newChain,
            validationResult: runValidation(newChain),
          };
        }),

      setValidationResult: (result) =>
        set({
          validationResult: result,
        }),

      resetChain: () =>
        set({
          chain: [],
          validationResult: null,
        }),
    }),
    {
      name: 'topology-store',
      storage: {
        getItem: (name: string) => {
          try {
            const item = asyncStorage.getItem(name);
            return item ? JSON.parse(item as any) : null;
          } catch {
            return null;
          }
        },
        setItem: (name: string, value: StorageValue<TopologyState>) => {
          asyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          asyncStorage.removeItem(name);
        },
      },
      // הרצת ולידציה מחדש אחרי שחזור מ-storage
      onRehydrateStorage: () => (state) => {
        if (state && state.chain.length > 0) {
          state.validationResult = runValidation(state.chain);
        }
      },
    }
  )
);
