
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

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
  }, [fadeAnim]);

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
  }, [isActive, phase, pulseAnim]);

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
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.header}>
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
                    - 4-4-8 breathing pattern{'\n'}
                    - Grounding exercises{'\n'}
                    - Gentle reminders{'\n'}
                    - You&apos;re in control
                  </Text>
                </View>

                <TouchableOpacity
                  style={[buttonStyles.panicButton, styles.activateButton]}
                  onPress={handleActivate}
                  activeOpacity={0.8}
                >
                  <Text style={[buttonStyles.panicButtonText, { fontSize: 20 }]}>
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
                    <View style={styles.breathingInner} />
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
                    This feeling will pass{'\n'}
                    You are safe right now{'\n'}
                    You&apos;ve survived 100% of your worst days
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
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
  },
  activateButton: {
    marginBottom: 24,
  },
  emergencyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 13,
    color: colors.black,
    lineHeight: 20,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 32,
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  breathCountText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  groundingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groundingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  groundingText: {
    fontSize: 13,
    color: colors.black,
    lineHeight: 20,
  },
  reminderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 24,
    textAlign: 'center',
  },
  stopButton: {
    marginTop: 16,
  },
});
