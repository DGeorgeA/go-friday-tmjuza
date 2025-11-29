
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { impulses } from '@/data/impulses';

export default function ImpulseHubsScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Impulse Hubs</Text>
          <Text style={styles.subtitle}>Choose an area to work on</Text>
        </View>

        <View style={styles.hubsGrid}>
          {impulses.map((impulse) => (
            <TouchableOpacity
              key={impulse.id}
              style={[styles.hubCard, { borderColor: impulse.color }]}
              onPress={() => router.push(`/(tabs)/(home)/hub/${impulse.id}` as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.hubIcon}>{impulse.icon}</Text>
              <Text style={styles.hubName}>{impulse.name}</Text>
              <Text style={styles.hubDescription}>{impulse.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.7,
  },
  hubsGrid: {
    gap: 16,
  },
  hubCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    boxShadow: '0px 4px 12px rgba(43, 43, 47, 0.08)',
    elevation: 3,
  },
  hubIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  hubName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
  },
  hubDescription: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
  },
});
