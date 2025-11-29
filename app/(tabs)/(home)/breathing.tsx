
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

export default function BreathingScreen() {
  const router = useRouter();
  const { patternId } = useLocalSearchParams();
  const pattern = breathingPatterns.find(p => p.id === patternId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);

  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!pattern || !isPlaying) return;

    const phaseDurations = {
      inhale: pattern.inhale,
      hold1: pattern.hold1,
      exhale: pattern.exhale,
      hold2: pattern.hold2,
    };

    const timer = setInterval(() => {
      setPhaseTime((prev) => {
        const currentDuration = phaseDurations[phase];
        if (prev >= currentDuration) {
          if (phase === 'inhale' && pattern.hold1 > 0) {
            setPhase('hold1');
            return 0;
          } else if ((phase === 'inhale' && pattern.hold1 === 0) || phase === 'hold1') {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && pattern.hold2 > 0) {
            setPhase('hold2');
            return 0;
          } else {
            if (currentCycle >= pattern.cycles - 1) {
              setIsPlaying(false);
              setCurrentCycle(0);
              setPhase('inhale');
              return 0;
            } else {
              setCurrentCycle(currentCycle + 1);
              setPhase('inhale');
              return 0;
            }
          }
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, phase, currentCycle, pattern]);

  useEffect(() => {
    if (!pattern) return;

    const targetValue = phase === 'inhale' ? 1 : phase === 'exhale' ? 0 : breatheAnim._value;
    const duration = phase === 'inhale' ? pattern.inhale * 1000 : phase === 'exhale' ? pattern.exhale * 1000 : 0;

    if (duration > 0) {
      Animated.timing(breatheAnim, {
        toValue: targetValue,
        duration,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, pattern]);

  if (!pattern) {
    return (
      <BlossomBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Pattern not found</Text>
        </View>
      </BlossomBackground>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
    }
  };

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
              <Text style={styles.title}>{pattern.name}</Text>
              <Text style={styles.subtitle}>{pattern.description}</Text>
            </View>

            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <View style={styles.breathingInner} />
              </Animated.View>
            </View>

            <View style={styles.phaseContainer}>
              <Text style={styles.phaseText}>{getPhaseText()}</Text>
              <Text style={styles.cycleText}>
                Cycle {currentCycle + 1} of {pattern.cycles}
              </Text>
            </View>

            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsText}>
                Inhale: {pattern.inhale}s
                {pattern.hold1 > 0 && ` • Hold: ${pattern.hold1}s`}
                {' • '}Exhale: {pattern.exhale}s
                {pattern.hold2 > 0 && ` • Hold: ${pattern.hold2}s`}
              </Text>
            </View>

            <TouchableOpacity
              style={[buttonStyles.primaryButton, styles.playButton]}
              onPress={() => {
                if (!isPlaying) {
                  setCurrentCycle(0);
                  setPhase('inhale');
                  setPhaseTime(0);
                }
                setIsPlaying(!isPlaying);
              }}
            >
              <Text style={buttonStyles.primaryButtonText}>
                {isPlaying ? 'Pause' : 'Start'}
              </Text>
            </TouchableOpacity>

            {currentCycle === pattern.cycles && !isPlaying && (
              <View style={styles.completionCard}>
                <Text style={styles.completionText}>Complete!</Text>
                <Text style={styles.completionSubtext}>
                  You&apos;ve finished all {pattern.cycles} cycles
                </Text>
              </View>
            )}
          </Animated.View>
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
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: 32,
  },
  breathingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  cycleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  instructionsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsText: {
    fontSize: 13,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 20,
  },
  playButton: {
    marginTop: 16,
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completionText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  completionSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: colors.black,
    textAlign: 'center',
  },
});
