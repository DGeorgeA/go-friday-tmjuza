
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

export default function QuickCalmScreen() {
  const router = useRouter();

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Quick Calm</Text>
            <Text style={styles.subtitle}>Instant relief in 60 seconds or less</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breathing Patterns</Text>
            {breathingPatterns.map((pattern, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
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
                      In: {pattern.inhale}s • Out: {pattern.exhale}s
                    </Text>
                    <Text style={styles.patternCycles}>{pattern.cycles} cycles</Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Tools</Text>
            
            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => console.log('5-4-3-2-1 Grounding')}
              activeOpacity={0.8}
            >
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
              <View style={styles.toolContent}>
                <Text style={styles.toolName}>Calming Affirmations</Text>
                <Text style={styles.toolDescription}>
                  Gentle reminders to ease your mind
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <QuickAccessBar />
      </View>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
  },
  patternCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  patternDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  patternCycles: {
    fontSize: 12,
    color: colors.black,
    fontWeight: '600',
  },
  toolCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolContent: {
    flex: 1,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
