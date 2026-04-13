// Ohm's Law Engine - כל 12 הנוסחאות
// כל הקלטים והפלטים ביחידות SI (W, V, A, Ω)
// מחזיר null אם קלט כלשהו הוא 0, null, או undefined

export const OhmEngine = {
  // Power (Watts) - הספק
  P_from_VI: (V: number | null, I: number | null): number | null => {
    if (V === null || V === undefined || V === 0 || I === null || I === undefined || I === 0) return null;
    return V * I;
  },

  P_from_V2R: (V: number | null, R: number | null): number | null => {
    if (V === null || V === undefined || V === 0 || R === null || R === undefined || R === 0) return null;
    return (V * V) / R;
  },

  P_from_I2R: (I: number | null, R: number | null): number | null => {
    if (I === null || I === undefined || I === 0 || R === null || R === undefined || R === 0) return null;
    return (I * I) * R;
  },

  // Voltage (Volts) - מתח
  V_from_IR: (I: number | null, R: number | null): number | null => {
    if (I === null || I === undefined || I === 0 || R === null || R === undefined || R === 0) return null;
    return I * R;
  },

  V_from_PI: (P: number | null, I: number | null): number | null => {
    if (P === null || P === undefined || P === 0 || I === null || I === undefined || I === 0) return null;
    return P / I;
  },

  V_from_PR: (P: number | null, R: number | null): number | null => {
    if (P === null || P === undefined || P === 0 || R === null || R === undefined || R === 0) return null;
    return Math.sqrt(P * R);
  },

  // Current (Amps) - זרם
  I_from_VR: (V: number | null, R: number | null): number | null => {
    if (V === null || V === undefined || V === 0 || R === null || R === undefined || R === 0) return null;
    return V / R;
  },

  I_from_PV: (P: number | null, V: number | null): number | null => {
    if (P === null || P === undefined || P === 0 || V === null || V === undefined || V === 0) return null;
    return P / V;
  },

  I_from_PR: (P: number | null, R: number | null): number | null => {
    if (P === null || P === undefined || P === 0 || R === null || R === undefined || R === 0) return null;
    return Math.sqrt(P / R);
  },

  // Resistance (Ohms) - התנגדות
  R_from_VI: (V: number | null, I: number | null): number | null => {
    if (V === null || V === undefined || V === 0 || I === null || I === undefined || I === 0) return null;
    return V / I;
  },

  R_from_V2P: (V: number | null, P: number | null): number | null => {
    if (V === null || V === undefined || V === 0 || P === null || P === undefined || P === 0) return null;
    return (V * V) / P;
  },

  R_from_PI2: (P: number | null, I: number | null): number | null => {
    if (P === null || P === undefined || P === 0 || I === null || I === undefined || I === 0) return null;
    return P / (I * I);
  },
};
