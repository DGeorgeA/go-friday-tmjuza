
import { Impulse, ImpulseHub, BreathingPattern, Exercise } from '@/types/impulse';

export const impulses: Impulse[] = [
  {
    id: 'stop-smoking',
    name: 'Stop Smoking',
    icon: 'smoke-free', // Material icon
    color: '#1A1A1A',
    description: 'Break free from smoking urges',
  },
  {
    id: 'move-body',
    name: 'Move Your Body',
    icon: 'directions-run', // Material icon
    color: '#1A1A1A',
    description: 'Activate your physical energy',
  },
  {
    id: 'eat-awareness',
    name: 'Eat With Awareness',
    icon: 'restaurant-menu', // Material icon
    color: '#1A1A1A',
    description: 'Cultivate mindful eating',
  },
  {
    id: 'return-calm',
    name: 'Return to Calm',
    icon: 'self-improvement', // Material icon
    color: '#1A1A1A',
    description: 'Find your center again',
  },
  {
    id: 'steady-breath',
    name: 'Steady Your Breath',
    icon: 'air', // Material icon
    color: '#1A1A1A',
    description: 'Anchor in your breathing',
  },
  {
    id: 'stop-doomscrolling',
    name: 'Stop Doomscrolling',
    icon: 'smartphone', // Material icon - mobile phone
    color: '#1A1A1A',
    description: 'Reclaim your attention',
  },
];

export const impulseHubs: Record<string, ImpulseHub> = {
  'stop-smoking': {
    impulse: 'stop-smoking',
    exercises: [
      {
        name: 'Urge Surfing',
        credit: 'Dr. Marlatt',
        steps: [
          'Notice the urge without judgment',
          'Take a deep breath in through your nose',
          'Observe the sensation like a wave',
          'Watch it rise, peak, and naturally fall',
          'You are not the urge, you are the observer',
          'The wave is passing',
        ],
      },
      {
        name: 'Delay & Distract',
        credit: 'CDC',
        steps: [
          'When the urge hits, delay for 10 minutes',
          'During this time, do something with your hands',
          'Drink a glass of water slowly',
          'Take a short walk around the room',
          'Call a friend or loved one',
          'The urge will pass',
        ],
      },
      {
        name: 'Diaphragmatic Breathing',
        credit: 'ALA',
        steps: [
          'Place one hand on your chest, one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Feel your belly rise, not your chest',
          'Hold gently for 2 counts',
          'Exhale slowly through your mouth for 6 counts',
          'Repeat this calming rhythm',
        ],
      },
      {
        name: 'Cognitive Labeling',
        credit: 'ACT Institute',
        steps: [
          'Notice the thought: "I want to smoke"',
          'Label it: "This is just a thought"',
          'Observe it without acting on it',
          'Thoughts are not commands',
          'You can watch them pass by',
          'You are in control',
        ],
      },
      {
        name: 'Hand-to-Heart',
        credit: 'MBRP',
        steps: [
          'Place your hand over your heart',
          'Feel the warmth and gentle pressure',
          'Take three slow, deep breaths',
          'Say to yourself: "This is a moment of difficulty"',
          'Say: "I am not alone in this struggle"',
          'Offer yourself compassion',
        ],
      },
    ],
  },
  'move-body': {
    impulse: 'move-body',
    exercises: [
      {
        name: '2-Min Activation',
        credit: 'BJ Fogg',
        steps: [
          'Stand up right now',
          'Do 10 jumping jacks',
          'Or 5 pushups if you prefer',
          'Or stretch for 2 minutes',
          'Movement creates motivation',
          'Not the other way around',
        ],
      },
      {
        name: 'Visualization',
        credit: 'Sports Psych Council',
        steps: [
          'Close your eyes',
          'Imagine yourself exercising',
          'See yourself feeling strong and energized',
          'Notice how good it feels to move',
          'Imagine completing your workout',
          'Now make it real',
        ],
      },
      {
        name: 'Implementation Intentions',
        credit: 'Gollwitzer',
        steps: [
          'Complete this sentence in your mind:',
          '"When I feel resistance to exercise..."',
          '"...I will put on my workout clothes"',
          'Be specific about when and where',
          'Make it automatic',
          'Your future self will thank you',
        ],
      },
      {
        name: 'Motion Priming',
        credit: 'Harvard Behavioral Activation',
        steps: [
          'Start with the tiniest movement',
          'Put on one shoe',
          'Walk to the door',
          'Step outside for 30 seconds',
          'Each small action builds momentum',
          'You&apos;re already moving',
        ],
      },
      {
        name: 'Readiness Body Scan',
        credit: 'Jon Kabat-Zinn',
        steps: [
          'Scan your body from head to toe',
          'Notice any tension or tightness',
          'Breathe into those areas',
          'Ask: "What does my body need right now?"',
          'Honor what you discover',
          'Movement is medicine',
        ],
      },
    ],
  },
  'eat-awareness': {
    impulse: 'eat-awareness',
    exercises: [
      {
        name: 'Hunger Scale',
        credit: 'Center for Mindful Eating',
        steps: [
          'Pause before eating',
          'Rate your hunger from 1 to 10',
          '1 = Starving, 10 = Uncomfortably full',
          'Aim to eat between 3-7',
          'Ask: Am I physically hungry?',
          'Or am I eating for another reason?',
        ],
      },
      {
        name: '3-Bite Savoring',
        credit: 'Stanford',
        steps: [
          'Take one bite of food',
          'Put down your utensil',
          'Close your eyes',
          'Notice the texture, temperature, flavor',
          'Chew slowly, at least 20 times',
          'Swallow mindfully before the next bite',
        ],
      },
      {
        name: 'Pause Routine',
        credit: 'MEI',
        steps: [
          'Before eating, take three deep breaths',
          'Look at your food with curiosity',
          'Notice the colors, shapes, aromas',
          'Express gratitude for this nourishment',
          'Set an intention to eat mindfully',
          'Now begin',
        ],
      },
      {
        name: 'Craving Deconstruction',
        credit: 'MBSR',
        steps: [
          'When a craving arises, pause',
          'Where do you feel it in your body?',
          'What does it actually feel like?',
          'Is it hunger, or something else?',
          'Breathe into the sensation',
          'Watch it change and soften',
        ],
      },
      {
        name: '5-Sense Grounding',
        credit: 'UCLA',
        steps: [
          'Before eating, engage all five senses',
          'See: Notice the colors and presentation',
          'Smell: Breathe in the aromas',
          'Touch: Feel the texture and temperature',
          'Hear: Listen to the sounds as you eat',
          'Taste: Savor each flavor fully',
        ],
      },
    ],
  },
  'return-calm': {
    impulse: 'return-calm',
    exercises: [
      {
        name: 'Box Breathing',
        credit: 'Navy SEALs',
        steps: [
          'Breathe in for 4 counts',
          'Hold for 4 counts',
          'Breathe out for 4 counts',
          'Hold for 4 counts',
          'Repeat this square pattern',
          'Feel the heat cooling down',
        ],
      },
      {
        name: 'Cognitive Reappraisal',
        credit: 'Beck Institute',
        steps: [
          'What story am I telling myself?',
          'Is there another way to see this?',
          'What would I tell a friend?',
          'Will this matter in a week? A year?',
          'What can I control right now?',
          'Choose your response',
        ],
      },
      {
        name: 'Name-It-To-Tame-It',
        credit: 'Dr. Siegel',
        steps: [
          'Name the emotion you&apos;re feeling',
          'Say it out loud or in your mind',
          '"I am feeling angry" or "I notice frustration"',
          'Naming reduces the intensity',
          'You are not the emotion',
          'You are the one observing it',
        ],
      },
      {
        name: 'Cooling-Off Countdown',
        credit: 'APA',
        steps: [
          'Count slowly backwards from 10 to 1',
          'With each number, release tension',
          '10... letting go',
          '9... breathing out',
          'Continue until you reach 1',
          'Notice the shift in your body',
        ],
      },
      {
        name: 'PMR',
        credit: 'Jacobson',
        steps: [
          'Tense your fists, hold for 5 seconds, release',
          'Tense your shoulders, hold, release',
          'Tense your face, hold, release',
          'Tense your stomach, hold, release',
          'Tense your legs, hold, release',
          'Feel the wave of relaxation',
        ],
      },
    ],
  },
  'steady-breath': {
    impulse: 'steady-breath',
    exercises: [
      {
        name: '4-4-8',
        credit: 'Harvard',
        steps: [
          'Breathe in for 4 counts',
          'Hold for 4 counts',
          'Breathe out for 8 counts',
          'The long exhale activates calm',
          'Repeat this pattern',
          'Feel your nervous system settle',
        ],
      },
      {
        name: '5-4-3-2-1 Grounding',
        credit: 'APA',
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste',
          'You are here, you are safe',
        ],
      },
      {
        name: 'Interoceptive Scan',
        credit: 'Anxiety Workbook',
        steps: [
          'Close your eyes',
          'Notice your heartbeat',
          'Feel your breath moving in and out',
          'Sense the temperature of your skin',
          'Notice any tension or ease',
          'You are connected to your body',
        ],
      },
      {
        name: 'Extended Exhale',
        credit: 'Huberman Lab',
        steps: [
          'Breathe in naturally',
          'Exhale for twice as long',
          'In for 3, out for 6',
          'Or in for 4, out for 8',
          'The extended exhale calms your system',
          'Continue for several breaths',
        ],
      },
      {
        name: 'Calm Hand Pressure',
        credit: 'NIMH',
        steps: [
          'Press your thumb into your palm',
          'Apply gentle, steady pressure',
          'Hold for 5 seconds',
          'Release and breathe',
          'Repeat on the other hand',
          'This activates your calming response',
        ],
      },
    ],
  },
  'stop-doomscrolling': {
    impulse: 'stop-doomscrolling',
    exercises: [
      {
        name: 'Micro-Pause',
        credit: 'Digital Wellbeing Inst.',
        steps: [
          'Put your phone face down',
          'Take three deep breaths',
          'Look around the room',
          'Notice something you haven&apos;t seen before',
          'Ask: What do I actually need right now?',
          'Choose consciously',
        ],
      },
      {
        name: 'Look Away',
        credit: 'WHO',
        steps: [
          'Every 20 minutes, look away from your screen',
          'Focus on something 20 feet away',
          'Hold for 20 seconds',
          'Blink several times',
          'Roll your shoulders back',
          'Return refreshed',
        ],
      },
      {
        name: 'Detachment Conditioning',
        credit: 'Nir Eyal',
        steps: [
          'Before checking your phone, pause',
          'Ask: "What am I looking for?"',
          'Is this intentional or automatic?',
          'Set a timer for 5 minutes',
          'Do one thing without your phone',
          'Notice how you feel',
        ],
      },
      {
        name: 'Focus Reset',
        credit: 'MIT',
        steps: [
          'Close all unnecessary tabs and apps',
          'Take three deep breaths',
          'Write down your one priority',
          'Set a timer for 25 minutes',
          'Work on only that one thing',
          'Your attention is precious',
        ],
      },
      {
        name: 'Attention Anchor',
        credit: 'UCLA',
        steps: [
          'Choose an anchor: your breath, a sound, a sensation',
          'When your mind wanders to your phone',
          'Gently return to your anchor',
          'No judgment, just return',
          'Practice this for 2 minutes',
          'You are training your attention',
        ],
      },
    ],
  },
};

export const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal counts for calm and focus',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4,
  },
  {
    id: '4-4-8',
    name: '4-4-8 Breathing',
    description: 'Extended exhale for relaxation',
    inhale: 4,
    hold1: 4,
    exhale: 8,
    hold2: 0,
    cycles: 6,
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic',
    description: 'Deep belly breathing',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    cycles: 8,
  },
  {
    id: 'resonant',
    name: 'Resonant Breathing',
    description: 'Balanced rhythm for coherence',
    inhale: 4.5,
    hold1: 0,
    exhale: 4.5,
    hold2: 0,
    cycles: 10,
  },
];

// User levels with blossom requirements
export const userLevels = [
  { level: 1, name: 'Seed', blossoms: 0 },
  { level: 2, name: 'Sprout', blossoms: 50 },
  { level: 3, name: 'Leaf', blossoms: 125 },
  { level: 4, name: 'Stem', blossoms: 250 },
  { level: 5, name: 'Early Bloom', blossoms: 400 },
  { level: 6, name: 'Blossom', blossoms: 600 },
  { level: 7, name: 'Gentle Wind', blossoms: 850 },
  { level: 8, name: 'Sakura Shade', blossoms: 1100 },
  { level: 9, name: 'Quiet Garden', blossoms: 1400 },
  { level: 10, name: 'Zen Grove', blossoms: 1750 },
  { level: 11, name: 'Calm Mountain', blossoms: 2200 },
  { level: 12, name: 'Friday Master', blossoms: 2700 },
];

// Helper function to get current level based on blossoms
export function getCurrentLevel(blossoms: number): { level: number; name: string; blossoms: number; nextLevel?: { level: number; name: string; blossoms: number } } {
  let currentLevel = userLevels[0];
  
  for (let i = userLevels.length - 1; i >= 0; i--) {
    if (blossoms >= userLevels[i].blossoms) {
      currentLevel = userLevels[i];
      const nextLevel = i < userLevels.length - 1 ? userLevels[i + 1] : undefined;
      return { ...currentLevel, nextLevel };
    }
  }
  
  return { ...currentLevel, nextLevel: userLevels[1] };
}
