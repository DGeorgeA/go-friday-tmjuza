
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulses, impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';

export default function HubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const impulseId = id as ImpulseType;
  
  const impulse = impulses.find(i => i.id === impulseId);
  const hub = impulseHubs[impulseId];

  if (!impulse || !hub) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hub not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.icon}>{impulse.icon}</Text>
          <Text style={styles.title}>{impulse.name}</Text>
          <Text style={styles.description}>{impulse.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Triggers</Text>
          <View style={styles.triggersContainer}>
            {hub.triggers.map((trigger, index) => (
              <View key={index} style={styles.triggerChip}>
                <Text style={styles.triggerText}>{trigger}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interventions</Text>
          {hub.interventions.map((intervention, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interventionCard}
              onPress={() => router.push({
                pathname: '/(tabs)/(home)/intervention',
                params: { impulseId, tierIndex: index }
              } as any)}
              activeOpacity={0.8}
            >
              <View style={styles.interventionHeader}>
                <View style={[styles.tierBadge, { backgroundColor: impulse.color }]}>
                  <Text style={styles.tierBadgeText}>
                    {intervention.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.durationText}>{intervention.duration}s</Text>
              </View>
              <Text style={styles.interventionTitle}>{intervention.title}</Text>
              <Text style={styles.interventionDescription}>
                {intervention.description}
              </Text>
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.warmPink,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 16,
  },
  triggersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.warmPink,
  },
  triggerText: {
    fontSize: 14,
    color: colors.charcoal,
    fontWeight: '500',
  },
  interventionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(43, 43, 47, 0.08)',
    elevation: 2,
  },
  interventionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tierBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  durationText: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.6,
    fontWeight: '600',
  },
  interventionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
  },
  interventionDescription: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: colors.charcoal,
    textAlign: 'center',
  },
});
