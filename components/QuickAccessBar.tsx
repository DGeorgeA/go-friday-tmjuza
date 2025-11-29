
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function QuickAccessBar() {
  const router = useRouter();

  const quickActions = [
    { label: 'Quick Calm', route: '/(tabs)/(home)/quick-calm', icon: '✨' },
    { label: 'Panic', route: '/(tabs)/(home)/panic', icon: '🆘' },
    { label: 'Relax', route: '/(tabs)/(home)/relax', icon: '🌸' },
  ];

  return (
    <View style={styles.container}>
      {quickActions.map((action, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{action.icon}</Text>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
