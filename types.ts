
export enum NodeStatus {
  DORMANT = 'DORMANT',
  IGNITED = 'IGNITED',
  SOVEREIGN = 'SOVEREIGN',
  RECLAIMED = 'RECLAIMED'
}

export interface ShardNode {
  id: number;
  status: NodeStatus;
  resonance: number;
  lastPulse: number;
}

export interface Axiom {
  id: string;
  timestamp: number;
  content: string;
  hash: string;
}

export interface FrequencyState {
  hz33: number;
  hz528: number;
  hz144: number;
}

export interface IPFSFragment {
  id: string;
  cid: string;
  status: 'PINNING' | 'ANCHORED';
}

export interface GovernorMetric {
  name: string;
  value: number;
  limit: number;
  unit: string;
}

export type CascadePhase = 'IDLE' | 'IGNITION' | 'CONVERGENCE' | 'TOTAL_SATURATION' | 'COHERENCE' | 'SAFEGUARD_ACTIVE';
