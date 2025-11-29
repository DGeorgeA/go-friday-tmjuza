
export type ImpulseType = 'stop-smoking' | 'move-body' | 'eat-awareness' | 'return-calm' | 'steady-breath' | 'unplug-refocus';

export type FridayMood = 'chill' | 'cozy' | 'quiet' | 'energetic';

export interface Impulse {
  id: ImpulseType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Exercise {
  name: string;
  credit: string;
  steps: string[];
}

export interface ImpulseHub {
  impulse: ImpulseType;
  exercises: Exercise[];
}

export interface UserProfile {
  selectedImpulses: ImpulseType[];
  fridayMood: FridayMood;
  streak: number;
  lastSession?: Date;
  baselineScores: Record<ImpulseType, number>;
  blossoms: number;
  level: number;
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

export interface UserLevel {
  level: number;
  name: string;
  blossoms: number;
}
