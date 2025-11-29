
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface MonkhoodBadgeProps {
  level: number;
  unlocked?: boolean;
  size?: number;
}

const MONKHOOD_STAGES = [
  { level: 1, name: 'Seed', icon: 'spa', blossoms: 0 },
  { level: 2, name: 'Novice', icon: 'self-improvement', blossoms: 50 },
  { level: 3, name: 'Apprentice', icon: 'nature-people', blossoms: 250 },
  { level: 4, name: 'Acolyte', icon: 'emoji-nature', blossoms: 600 },
  { level: 5, name: 'Monk', icon: 'psychology', blossoms: 1100 },
  { level: 6, name: 'Enlightened', icon: 'auto-awesome', blossoms: 2200 },
];

export default function MonkhoodBadge({ level, unlocked = true, size = 40 }: MonkhoodBadgeProps) {
  const stage = MONKHOOD_STAGES.find((s) => s.level === level) || MONKHOOD_STAGES[0];
  
  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2 },
      unlocked && styles.unlocked,
    ]}>
      <IconSymbol
        android_material_icon_name={stage.icon as any}
        ios_icon_name={stage.icon}
        size={size * 0.6}
        color={unlocked ? colors.black : colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlocked: {
    shadowColor: colors.blossomPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
