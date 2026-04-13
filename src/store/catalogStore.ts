import { create } from 'zustand';
import { Catalog, Player, Mixer, Matrix, Amplifier, Speaker } from '../types/catalog';
import catalogData from '../data/catalog.json';

// קטלוג — מצב חיפוש, סינון קטגוריה ומוצר נבחר

export type CategoryKey = 'all' | 'players' | 'mixers' | 'matrices' | 'amplifiers' | 'speakers';
export type AnyProduct = Player | Mixer | Matrix | Amplifier | Speaker;

export interface CatalogSection {
  category: CategoryKey;
  title: string;
  data: AnyProduct[];
}

interface CatalogState {
  // נתונים
  catalog: Catalog;
  searchQuery: string;
  activeCategory: CategoryKey;
  selectedProduct: AnyProduct | null;
  selectedProductCategory: CategoryKey | null;

  // פעולות
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: CategoryKey) => void;
  selectProduct: (product: AnyProduct, category: CategoryKey) => void;
  clearSelection: () => void;
  resetSearch: () => void;
}

// חיפוש לפי שם או דגם — תומך עברית ואנגלית, ללא תלות ברישיות
function matchesSearch(product: AnyProduct, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase().trim();
  return (
    product.name.toLowerCase().includes(q) ||
    product.model.toLowerCase().includes(q) ||
    product.manufacturer.toLowerCase().includes(q)
  );
}

export const useCatalogStore = create<CatalogState>((set) => ({
  catalog: catalogData as Catalog,
  searchQuery: '',
  activeCategory: 'all',
  selectedProduct: null,
  selectedProductCategory: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  selectProduct: (product, category) =>
    set({ selectedProduct: product, selectedProductCategory: category }),
  clearSelection: () => set({ selectedProduct: null, selectedProductCategory: null }),
  resetSearch: () => set({ searchQuery: '', activeCategory: 'all' }),
}));

// סלקטור — מחזיר את הסקשנים המסוננים לפי חיפוש וקטגוריה
export function getFilteredSections(state: CatalogState): CatalogSection[] {
  const { catalog, searchQuery, activeCategory } = state;

  const categoryMap: { key: Exclude<CategoryKey, 'all'>; title: string; data: AnyProduct[] }[] = [
    { key: 'players', title: 'נגנים', data: catalog.players },
    { key: 'mixers', title: 'מיקסרים', data: catalog.mixers },
    { key: 'matrices', title: 'מטריצות', data: catalog.matrices },
    { key: 'amplifiers', title: 'מגברים', data: catalog.amplifiers },
    { key: 'speakers', title: 'רמקולים', data: catalog.speakers },
  ];

  return categoryMap
    .filter(({ key }) => activeCategory === 'all' || activeCategory === key)
    .map(({ key, title, data }) => ({
      category: key as CategoryKey,
      title,
      data: data.filter((p) => matchesSearch(p, searchQuery)),
    }))
    .filter((section) => section.data.length > 0);
}
