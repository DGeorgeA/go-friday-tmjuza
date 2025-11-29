
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';

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
          // Move to next phase
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
            // Complete cycle
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
      <View style={styles.container}>
        <Text style={styles.errorText}>Pattern not found</Text>
      </View>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
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
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

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
            <Text style={styles.breathingEmoji}>🌸</Text>
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
            <Text style={styles.completionEmoji}>✨</Text>
            <Text style={styles.completionText}>Complete!</Text>
            <Text style={styles.completionSubtext}>
              You&apos;ve finished all {pattern.cycles} cycles
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    fontSize: 28,
    color: colors.charcoal,
    fontWeight: '300',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    marginBottom: 32,
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.warmPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingEmoji: {
    fontSize: 40,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
  },
  cycleText: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.6,
  },
  instructionsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.charcoal,
    textAlign: 'center',
    lineHeight: 20,
  },
  playButton: {
    marginTop: 'auto',
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  completionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  completionText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
  },
  completionSubtext: {
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
