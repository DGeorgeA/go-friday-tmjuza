
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';

export default function QuickCalmScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.title}>Quick Calm</Text>
          <Text style={styles.subtitle}>Instant relief in 60 seconds or less</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breathing Patterns</Text>
          {breathingPatterns.map((pattern) => (
            <TouchableOpacity
              key={pattern.id}
              style={styles.patternCard}
              onPress={() => router.push({
                pathname: '/(tabs)/(home)/breathing',
                params: { patternId: pattern.id }
              } as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.patternName}>{pattern.name}</Text>
              <Text style={styles.patternDescription}>{pattern.description}</Text>
              <View style={styles.patternDetails}>
                <Text style={styles.patternDetailText}>
                  In: {pattern.inhale}s • Hold: {pattern.hold1}s • Out: {pattern.exhale}s
                  {pattern.hold2 > 0 && ` • Hold: ${pattern.hold2}s`}
                </Text>
                <Text style={styles.patternCycles}>{pattern.cycles} cycles</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tools</Text>
          
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => console.log('5-4-3-2-1 Grounding')}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>👁️</Text>
            <View style={styles.toolContent}>
              <Text style={styles.toolName}>5-4-3-2-1 Grounding</Text>
              <Text style={styles.toolDescription}>
                Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => console.log('Body Scan')}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>🧘</Text>
            <View style={styles.toolContent}>
              <Text style={styles.toolName}>Quick Body Scan</Text>
              <Text style={styles.toolDescription}>
                Release tension from head to toe in 60 seconds
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => console.log('Affirmations')}
            activeOpacity={0.8}
          >
            <Text style={styles.toolIcon}>💭</Text>
            <View style={styles.toolContent}>
              <Text style={styles.toolName}>Calming Affirmations</Text>
              <Text style={styles.toolDescription}>
                Gentle reminders to ease your mind
              </Text>
            </View>
          </TouchableOpacity>
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
  subtitle: {
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
  patternCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(43, 43, 47, 0.08)',
    elevation: 2,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.7,
    marginBottom: 12,
  },
  patternDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternDetailText: {
    fontSize: 12,
    color: colors.charcoal,
    opacity: 0.6,
    flex: 1,
  },
  patternCycles: {
    fontSize: 12,
    color: colors.warmPink,
    fontWeight: '600',
  },
  toolCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(43, 43, 47, 0.08)',
    elevation: 2,
  },
  toolIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.7,
  },
});
