
export type ImpulseType = 'smoking' | 'gym' | 'overeating' | 'anger' | 'panic' | 'scrolling';

export type FridayMood = 'chill' | 'cozy' | 'quiet' | 'energetic';

export interface Impulse {
  id: ImpulseType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface InterventionTier {
  type: 'micro' | 'short' | 'plan';
  duration: number; // in seconds
  title: string;
  description: string;
  script?: string[];
}

export interface ImpulseHub {
  impulse: ImpulseType;
  triggers: string[];
  interventions: InterventionTier[];
  progress: number; // 0-100
}

export interface UserProfile {
  selectedImpulses: ImpulseType[];
  fridayMood: FridayMood;
  streak: number;
  lastSession?: Date;
  baselineScores: Record<ImpulseType, number>;
}

export interface TriggerLog {
  id: string;
  impulse: ImpulseType;
  timestamp: Date;
  mood: number; // 1-10
  environment: string;
  notes: string;
  handled: boolean;
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
}
