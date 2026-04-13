export interface Player {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  outputType: "RCA" | "XLR" | "RCA+XLR";
  outputVoltage: number;
  outputNote?: string;
  additionalOutputs?: string[];
  streamingProtocols?: string[];
  connectivity?: string[];
  maxResolution?: string;
}

export interface Mixer {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  inputCount: number;
  outputCount: number;
  gainStages: number;
}

export interface Matrix {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  inputs: number;
  outputs: number;
  routingMatrix: boolean[][];
  maxPathsPerOutput: number;
  zones?: number;
  zoneFeatures?: {
    independentVolume: boolean;
    bassControl: boolean;
    trebleControl: boolean;
    subwooferCrossover: boolean;
  };
  builtIn?: string[];
  dsp?: boolean;
}

export interface Amplifier {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  channels: number;
  powerPerChannel: number;
  minImpedance: number;
  supports70V: boolean;
  supports100V: boolean;
  dsp?: boolean;
  totalPower?: number;
  intelliDrive?: boolean;
}

export interface Speaker {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  powerRating: number;
  impedance: number;
  hasLineTransformer: boolean;
  transformerTaps?: number[];
}

export interface Catalog {
  players: Player[];
  mixers: Mixer[];
  matrices: Matrix[];
  amplifiers: Amplifier[];
  speakers: Speaker[];
}

// Topology / Signal Chain Types
export type NodeType = "source" | "mixer" | "matrix" | "amplifier" | "speaker_group";

export interface ChainNode {
  id: string;
  type: NodeType;
  productId: string;
  wiring?: "series" | "parallel"; // speakers only
  quantity?: number; // speakers only
}

// Validation Types
export interface ValidationResult {
  impedanceOk: boolean;
  powerOk: boolean;
  lineVoltageOk: boolean;
  impedanceActual: number;
  impedanceMin: number;
  powerRequired: number;
  powerAvailable: number;
  lineVoltageRequired: boolean; // true if any speaker has a line transformer
  errors: string[];
}
