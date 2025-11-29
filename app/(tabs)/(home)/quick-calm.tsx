
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';

export default function QuickCalmScreen() {
  const router = useRouter();

  const handlePatternPress = (patternId: string) => {
    router.push({
      pathname: '/(tabs)/(home)/breathing',
      params: { patternId }
    } as any);
  };

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
                  onPress={() => handlePatternPress(pattern.id)}
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

          {/* Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 32,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  patternCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  patternDescription: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  patternDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patternDetailText: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    flex: 1,
  },
  patternCycles: {
    fontSize: 13,
    color: colors.black,
    fontWeight: '400',
  },
  bottomSpacer: {
    height: 40,
  },
});
