// עכבה Engine - חישובים לרמקולים בטור ובמקביל
// Series: Ztotal = Z1 + Z2 + ... + Zn
// Parallel: 1/Ztotal = 1/Z1 + 1/Z2 + ... + 1/Zn

export const seriesImpedance = (impedances: number[]): number => {
  if (impedances.length === 0) return 0;
  return impedances.reduce((sum, z) => sum + z, 0);
};

export const parallelImpedance = (impedances: number[]): number => {
  if (impedances.length === 0) return 0;
  const sumOfReciprocals = impedances.reduce((sum, z) => sum + 1 / z, 0);
  return 1 / sumOfReciprocals;
};
