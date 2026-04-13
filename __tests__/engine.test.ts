import { OhmEngine } from '../src/engine/ohm';
import { seriesImpedance, parallelImpedance } from '../src/engine/impedance';
import { validateChain } from '../src/engine/validator';
import type { Catalog, ChainNode } from '../src/types/catalog';

// ---- OhmEngine ----

describe('OhmEngine', () => {
  describe('Power formulas', () => {
    it('P_from_VI: 12V × 2A = 24W', () => {
      expect(OhmEngine.P_from_VI(12, 2)).toBeCloseTo(24);
    });
    it('P_from_V2R: 12V² / 6Ω = 24W', () => {
      expect(OhmEngine.P_from_V2R(12, 6)).toBeCloseTo(24);
    });
    it('P_from_I2R: 2A² × 6Ω = 24W', () => {
      expect(OhmEngine.P_from_I2R(2, 6)).toBeCloseTo(24);
    });
    it('returns null for zero inputs', () => {
      expect(OhmEngine.P_from_VI(0, 2)).toBeNull();
      expect(OhmEngine.P_from_VI(12, 0)).toBeNull();
      expect(OhmEngine.P_from_VI(null, 2)).toBeNull();
    });
  });

  describe('Voltage formulas', () => {
    it('V_from_IR: 2A × 6Ω = 12V', () => {
      expect(OhmEngine.V_from_IR(2, 6)).toBeCloseTo(12);
    });
    it('V_from_PI: 24W / 2A = 12V', () => {
      expect(OhmEngine.V_from_PI(24, 2)).toBeCloseTo(12);
    });
    it('V_from_PR: √(24W × 6Ω) = 12V', () => {
      expect(OhmEngine.V_from_PR(24, 6)).toBeCloseTo(12);
    });
  });

  describe('Current formulas', () => {
    it('I_from_VR: 12V / 6Ω = 2A', () => {
      expect(OhmEngine.I_from_VR(12, 6)).toBeCloseTo(2);
    });
    it('I_from_PV: 24W / 12V = 2A', () => {
      expect(OhmEngine.I_from_PV(24, 12)).toBeCloseTo(2);
    });
    it('I_from_PR: √(24W / 6Ω) = 2A', () => {
      expect(OhmEngine.I_from_PR(24, 6)).toBeCloseTo(2);
    });
  });

  describe('Resistance formulas', () => {
    it('R_from_VI: 12V / 2A = 6Ω', () => {
      expect(OhmEngine.R_from_VI(12, 2)).toBeCloseTo(6);
    });
    it('R_from_V2P: 12V² / 24W = 6Ω', () => {
      expect(OhmEngine.R_from_V2P(12, 24)).toBeCloseTo(6);
    });
    it('R_from_PI2: 24W / 2A² = 6Ω', () => {
      expect(OhmEngine.R_from_PI2(24, 2)).toBeCloseTo(6);
    });
  });
});

// ---- Impedance ----

describe('seriesImpedance', () => {
  it('sums impedances: 8Ω + 8Ω = 16Ω', () => {
    expect(seriesImpedance([8, 8])).toBeCloseTo(16);
  });
  it('single speaker: 8Ω', () => {
    expect(seriesImpedance([8])).toBeCloseTo(8);
  });
  it('empty array returns 0', () => {
    expect(seriesImpedance([])).toBe(0);
  });
});

describe('parallelImpedance', () => {
  it('two 8Ω in parallel = 4Ω', () => {
    expect(parallelImpedance([8, 8])).toBeCloseTo(4);
  });
  it('four 8Ω in parallel = 2Ω', () => {
    expect(parallelImpedance([8, 8, 8, 8])).toBeCloseTo(2);
  });
  it('single speaker: 8Ω', () => {
    expect(parallelImpedance([8])).toBeCloseTo(8);
  });
  it('empty array returns 0', () => {
    expect(parallelImpedance([])).toBe(0);
  });
});

// ---- Validator ----

const mockCatalog: Catalog = {
  players: [],
  mixers: [],
  matrices: [],
  amplifiers: [
    {
      id: 'amp-test-4ch',
      name: 'Test Amp',
      model: 'TestAmp-4CH',
      powerPerChannel: 100,
      channels: 4,
      minImpedance: 4,
      supports70V: false,
      supports100V: false,
    },
    {
      id: 'amp-test-70v',
      name: 'Test Amp 70V',
      model: 'TestAmp-70V',
      powerPerChannel: 200,
      channels: 4,
      minImpedance: 4,
      supports70V: true,
      supports100V: false,
    },
  ],
  speakers: [
    {
      id: 'spk-test-8ohm',
      name: 'Test Speaker 8Ω',
      model: 'SPK-8',
      powerRating: 30,
      impedance: 8,
      hasLineTransformer: false,
    },
    {
      id: 'spk-test-line',
      name: 'Test Line Speaker',
      model: 'SPK-LINE',
      powerRating: 10,
      impedance: 8,
      hasLineTransformer: true,
      transformerTaps: [5, 10],
    },
  ],
};

const baseChain: ChainNode[] = [
  { id: 'n1', type: 'source', productId: 'player-test' },
  { id: 'n2', type: 'amplifier', productId: 'amp-test-4ch' },
  { id: 'n3', type: 'speaker_group', productId: 'spk-test-8ohm', wiring: 'parallel', quantity: 2 },
];

describe('validateChain', () => {
  it('passes when 2×8Ω parallel = 4Ω (meets min 4Ω) and power OK', () => {
    const result = validateChain(baseChain, mockCatalog);
    expect(result.impedanceOk).toBe(true);
    expect(result.impedanceActual).toBeCloseTo(4);
    expect(result.powerOk).toBe(true);
    expect(result.powerRequired).toBe(60); // 30W × 2
    expect(result.errors).toHaveLength(0);
  });

  it('fails impedance when 4×8Ω parallel = 2Ω (below min 4Ω)', () => {
    const chain: ChainNode[] = [
      ...baseChain.slice(0, 2),
      { id: 'n3', type: 'speaker_group', productId: 'spk-test-8ohm', wiring: 'parallel', quantity: 4 },
    ];
    const result = validateChain(chain, mockCatalog);
    expect(result.impedanceOk).toBe(false);
    expect(result.impedanceActual).toBeCloseTo(2);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('fails power when speakers demand exceeds amp', () => {
    const chain: ChainNode[] = [
      ...baseChain.slice(0, 2),
      { id: 'n3', type: 'speaker_group', productId: 'spk-test-8ohm', wiring: 'series', quantity: 4 },
    ];
    const result = validateChain(chain, mockCatalog);
    expect(result.powerOk).toBe(false);
    expect(result.powerRequired).toBe(120); // 30W × 4
    expect(result.errors.some(e => e.includes('הספק'))).toBe(true);
  });

  it('reports error when chain has no source', () => {
    const chain = baseChain.filter(n => n.type !== 'source');
    const result = validateChain(chain, mockCatalog);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('line-transformer speaker passes with 70V amplifier', () => {
    const chain: ChainNode[] = [
      { id: 'n1', type: 'source', productId: 'player-test' },
      { id: 'n2', type: 'amplifier', productId: 'amp-test-70v' },
      { id: 'n3', type: 'speaker_group', productId: 'spk-test-line', wiring: 'series', quantity: 1 },
    ];
    const result = validateChain(chain, mockCatalog);
    expect(result.lineVoltageRequired).toBe(true);
    expect(result.lineVoltageOk).toBe(true);
  });

  it('line-transformer speaker fails with non-70V amplifier', () => {
    const chain: ChainNode[] = [
      { id: 'n1', type: 'source', productId: 'player-test' },
      { id: 'n2', type: 'amplifier', productId: 'amp-test-4ch' },
      { id: 'n3', type: 'speaker_group', productId: 'spk-test-line', wiring: 'series', quantity: 1 },
    ];
    const result = validateChain(chain, mockCatalog);
    expect(result.lineVoltageRequired).toBe(true);
    expect(result.lineVoltageOk).toBe(false);
    expect(result.errors.some(e => e.includes('70V'))).toBe(true);
  });
});
