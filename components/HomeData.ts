
// This file is kept for backward compatibility but is no longer used
// Impulse hubs are now defined in data/impulses.ts

export const homeButtons = [
  { text: 'Relax Into Friday', route: '/(tabs)/(home)/relax', icon: 'spa' },
  { text: 'Impulse Hubs', route: '/(tabs)/(home)/hubs', icon: 'grid-view' },
  { text: 'Quick Calm', route: '/(tabs)/(home)/quick-calm', icon: 'self-improvement' },
  { text: 'Panic Button', route: '/(tabs)/(home)/panic', icon: 'warning' },
];

export type HomeButton = typeof homeButtons[0];
