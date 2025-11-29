
export const homeButtons = [
  { text: 'Relax Into Friday', route: '/(tabs)/(home)/relax', icon: '🌸' },
  { text: 'Impulse Hubs', route: '/(tabs)/(home)/hubs', icon: '🎯' },
  { text: 'Quick Calm', route: '/(tabs)/(home)/quick-calm', icon: '✨' },
  { text: 'Panic Button', route: '/(tabs)/(home)/panic', icon: '🆘' },
];

export type HomeButton = typeof homeButtons[0];
