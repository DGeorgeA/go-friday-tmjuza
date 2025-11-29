
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

export default function PanicButtonScreen() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isActive) {
      const sequence = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold', duration: 4000 },
        { phase: 'exhale', duration: 8000 },
      ];

      let currentIndex = 0;

      const runSequence = () => {
        const current = sequence[currentIndex];
        setPhase(current.phase as any);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setTimeout(() => {
          currentIndex = (currentIndex + 1) % sequence.length;
          if (currentIndex === 0) {
            setBreathCount((prev) => prev + 1);
          }
          runSequence();
        }, current.duration);
      };

      runSequence();
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: phase === 'inhale' ? 4000 : phase === 'hold' ? 4000 : 8000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, phase]);

  const handleActivate = () => {
    setIsActive(true);
    setBreathCount(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleStop = () => {
    setIsActive(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In (4s)';
      case 'hold':
        return 'Hold (4s)';
      case 'exhale':
        return 'Breathe Out (8s)';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.icon}>🆘</Text>
          <Text style={styles.title}>Panic Button</Text>
          <Text style={styles.subtitle}>
            You&apos;re safe. Let&apos;s calm your nervous system together.
          </Text>
        </View>

        {!isActive ? (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>What happens next:</Text>
              <Text style={styles.infoText}>
                • 4-4-8 breathing pattern{'\n'}
                • Grounding exercises{'\n'}
                • Gentle reminders{'\n'}
                • You&apos;re in control
              </Text>
            </View>

            <TouchableOpacity
              style={[buttonStyles.panicButton, styles.activateButton]}
              onPress={handleActivate}
              activeOpacity={0.8}
            >
              <Text style={[buttonStyles.panicButtonText, { fontSize: 24 }]}>
                I Need Help Now
              </Text>
            </TouchableOpacity>

            <View style={styles.emergencyCard}>
              <Text style={styles.emergencyTitle}>In Crisis?</Text>
              <Text style={styles.emergencyText}>
                Call 988 (Suicide & Crisis Lifeline){'\n'}
                Text HOME to 741741 (Crisis Text Line)
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                <Text style={styles.breathingEmoji}>🌸</Text>
              </Animated.View>
            </View>

            <View style={styles.phaseContainer}>
              <Text style={styles.phaseText}>{getPhaseText()}</Text>
              <Text style={styles.breathCountText}>
                {breathCount} breath{breathCount !== 1 ? 's' : ''} completed
              </Text>
            </View>

            <View style={styles.groundingCard}>
              <Text style={styles.groundingTitle}>While you breathe:</Text>
              <Text style={styles.groundingText}>
                Name 5 things you can see{'\n'}
                4 things you can touch{'\n'}
                3 things you can hear{'\n'}
                2 things you can smell{'\n'}
                1 thing you can taste
              </Text>
            </View>

            <View style={styles.reminderCard}>
              <Text style={styles.reminderText}>
                💙 This feeling will pass{'\n'}
                💙 You are safe right now{'\n'}
                💙 You&apos;ve survived 100% of your worst days
              </Text>
            </View>

            <TouchableOpacity
              style={[buttonStyles.secondaryButton, styles.stopButton]}
              onPress={handleStop}
            >
              <Text style={buttonStyles.secondaryButtonText}>
                I&apos;m Feeling Better
              </Text>
            </TouchableOpacity>
          </>
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
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 24,
  },
  activateButton: {
    marginBottom: 24,
  },
  emergencyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: colors.charcoal,
    lineHeight: 20,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 32,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.warmPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingEmoji: {
    fontSize: 48,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
  },
  breathCountText: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.6,
  },
  groundingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  groundingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
  },
  groundingText: {
    fontSize: 14,
    color: colors.charcoal,
    lineHeight: 22,
  },
  reminderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  reminderText: {
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 28,
    textAlign: 'center',
  },
  stopButton: {
    marginTop: 'auto',
  },
});
