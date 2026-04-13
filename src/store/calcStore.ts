import { create } from 'zustand';

// מצב מחשבון Ohm's Law - קלט של שני משתנים וחישוב של היעד

export type CalculatorVariable = 'P' | 'V' | 'I' | 'R';

interface CalculatorState {
  // קלט משתמש
  input1: number | null;
  input2: number | null;
  targetVariable: CalculatorVariable; // איזה משתנה לחשב

  // פלט
  result: number | null;

  // פעולות
  setInput1: (value: number | null) => void;
  setInput2: (value: number | null) => void;
  setTargetVariable: (variable: CalculatorVariable) => void;
  setResult: (value: number | null) => void;
  reset: () => void;
}

const initialState = {
  input1: null,
  input2: null,
  targetVariable: 'P' as CalculatorVariable,
  result: null,
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  ...initialState,

  setInput1: (value) => set({ input1: value }),
  setInput2: (value) => set({ input2: value }),
  setTargetVariable: (variable) => set({ targetVariable: variable }),
  setResult: (value) => set({ result: value }),
  reset: () => set(initialState),
}));
