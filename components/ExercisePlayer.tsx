
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Timing constants (in milliseconds)
const STEP_BASE_MS = 2000; // 2 seconds base
const INTERVAL_DURATION_MS = 5000; // 5 seconds fixed interval
const ACCENT_PINK = '#FF8DAA';
const PHOTO_OPACITY = 0.10;

// B&W motivational photo URLs (Unsplash - optimized)
const BW_PHOTOS: Record<string, string> = {
  stop_smoking: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&sat=-100',
  move_body: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&sat=-100',
  eat_awareness: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&sat=-100',
  return_to_calm: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&sat=-100',
  steady_breath: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80&sat=-100',
  unplug_refocus: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80&sat=-100',
  default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&sat=-100',
};

interface Exercise {
  id: string;
  text: string;
  baseDurationSeconds?: number;
}

interface ExercisePlayerProps {
  hub: string;
  exercises: Exercise[];
  onClose: () => void;
  onComplete: (summary: any) => void;
}

interface Settings {
  showBackgroundPhotos: boolean;
  showBlossoms: boolean;
  fastGesturesEnabled: boolean;
  resetSlowdownEachSession: boolean;
}

export default function ExercisePlayer({
  hub,
  exercises,
  onClose,
  onComplete,
}: ExercisePlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showInterval, setShowInterval] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(5);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1, 2, or 3
  const [isAccelerated, setIsAccelerated] = useState(false); // Long-press mode
  const [settings, setSettings] = useState<Settings>({
    showBackgroundPhotos: true,
    showBlossoms: true,
    fastGesturesEnabled: true,
    resetSlowdownEachSession: true,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const sessionStartTimeRef = useRef<Date>(new Date());

  // Load settings and check accessibility
  useEffect(() => {
    loadSettings();
    checkAccessibility();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@gofriday_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkAccessibility = async () => {
    try {
      const enabled = await AccessibilityInfo.isReduceMotionEnabled();
      setReducedMotion(enabled || false);
    } catch (error) {
      console.error('Error checking accessibility:', error);
    }
  };

  // Initialize component
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start breathing animation
    if (!reducedMotion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Auto-start first step within 150ms
    setTimeout(() => {
      if (exercises.length > 0) {
        startStep(0);
        emitAnalyticsEvent('exercise_started', {
          hub,
          exercise_id: exercises[0]?.id,
          step_index: 0,
          timestamp: new Date().toISOString(),
        });
      }
    }, 50);

    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
  };

  const getCurrentDuration = (stepIndex: number): number => {
    if (isAccelerated) return 1; // 1 second when accelerated

    const baseSeconds = exercises[stepIndex]?.baseDurationSeconds || 2;
    return baseSeconds * speedMultiplier;
  };

  const startStep = (stepIndex: number) => {
    if (stepIndex >= exercises.length) {
      handleSessionComplete();
      return;
    }

    setCurrentStepIndex(stepIndex);
    setShowInterval(false);

    const durationSeconds = getCurrentDuration(stepIndex);
    setRemainingSeconds(durationSeconds);
    startTimeRef.current = new Date();

    // Clear any existing timer
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    // Countdown timer (updates every second)
    let remaining = durationSeconds;
    stepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        handleStepComplete(stepIndex);
      }
    }, 1000);
  };

  const handleStepComplete = (stepIndex: number) => {
    // Check if there's a next step
    if (stepIndex + 1 < exercises.length) {
      // Show 5-second interval
      setShowInterval(true);
      setIntervalSeconds(5);
      startIntervalCountdown(stepIndex + 1);
    } else {
      // No more steps - complete session
      handleSessionComplete();
    }
  };

  const startIntervalCountdown = (nextStepIndex: number) => {
    let countdown = 5;
    setIntervalSeconds(countdown);

    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

    intervalTimerRef.current = setInterval(() => {
      countdown -= 1;
      setIntervalSeconds(countdown);

      if (countdown <= 0) {
        if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
        startStep(nextStepIndex);
      }
    }, 1000);
  };

  const handleSessionComplete = () => {
    clearAllTimers();
    const duration = Math.floor(
      (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000
    );

    emitAnalyticsEvent('exercise_completed', {
      hub,
      totalSteps: exercises.length,
      duration,
      timestamp: new Date().toISOString(),
    });

    onComplete({
      completed: true,
      duration_seconds: duration,
      steps_completed: exercises.length,
    });
  };

  const handleSlowdown = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const oldSpeed = speedMultiplier;
    const newSpeed = (speedMultiplier % 3) + 1; // Cycle 1 → 2 → 3 → 1
    setSpeedMultiplier(newSpeed);

    // Emit analytics event
    emitAnalyticsEvent('exercise_slowdown_changed', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      oldSpeed: `${oldSpeed}x`,
      newSpeed: `${newSpeed}x`,
      timestamp: new Date().toISOString(),
    });

    // If currently mid-step, update remaining seconds to new duration
    if (!showInterval) {
      const newDuration = getCurrentDuration(currentStepIndex);
      setRemainingSeconds(newDuration);

      // Restart timer with new duration
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);

      let remaining = newDuration;
      stepTimerRef.current = setInterval(() => {
        remaining -= 1;
        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          handleStepComplete(currentStepIndex);
        }
      }, 1000);
    }
  };

  const handleFastForwardPress = () => {
    if (!settings.fastGesturesEnabled) {
      handleFastForwardSingle();
      return;
    }

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Handle tap count for double tap detection
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      // First tap - wait for potential second tap
      tapTimerRef.current = setTimeout(() => {
        handleFastForwardSingle();
        tapCountRef.current = 0;
      }, 300);
    } else if (tapCountRef.current === 2) {
      // Double tap - jump to final step
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      handleFastForwardDouble();
      tapCountRef.current = 0;
    }
  };

  const handleFastForwardSingle = () => {
    // If in interval, skip to next exercise
    if (showInterval) {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

      emitAnalyticsEvent('interval_skipped', {
        hub,
        next_exercise_id: exercises[currentStepIndex + 1]?.id,
        timestamp: new Date().toISOString(),
      });

      const nextIndex = currentStepIndex + 1;
      if (nextIndex >= exercises.length) {
        handleSessionComplete();
      } else {
        startStep(nextIndex);
      }
      return;
    }

    // If in exercise, end step and enter interval
    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      fromStep: currentStepIndex,
      toStep: currentStepIndex + 1,
      timestamp: new Date().toISOString(),
    });

    clearAllTimers();
    handleStepComplete(currentStepIndex);
  };

  const handleFastForwardDouble = () => {
    if (!settings.fastGesturesEnabled) return;

    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      fromStep: currentStepIndex,
      toStep: exercises.length - 1,
      action: 'double_tap',
      timestamp: new Date().toISOString(),
    });

    clearAllTimers();
    handleSessionComplete();
  };

  const handleFastForwardLongPress = () => {
    if (!settings.fastGesturesEnabled) return;

    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      fromStep: currentStepIndex,
      toStep: 'accelerated',
      action: 'long_press',
      timestamp: new Date().toISOString(),
    });

    // Set subsequent step durations to 1s
    setIsAccelerated(true);

    // Restart current step with 1s duration
    if (!showInterval) {
      setRemainingSeconds(1);

      if (stepTimerRef.current) clearInterval(stepTimerRef.current);

      let remaining = 1;
      stepTimerRef.current = setInterval(() => {
        remaining -= 1;
        setRemainingSeconds(remaining);

        if (remaining <= 0) {
          if (stepTimerRef.current) clearInterval(stepTimerRef.current);
          handleStepComplete(currentStepIndex);
        }
      }, 1000);
    }
  };

  const handleClose = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    emitAnalyticsEvent('exercise_aborted', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
    });

    clearAllTimers();
    onClose();
  };

  const emitAnalyticsEvent = (eventName: string, payload: any) => {
    console.log(`[Analytics] ${eventName}:`, payload);
    // TODO: Send to analytics service
  };

  if (exercises.length === 0) {
    return (
      <BlossomBackground showBlossoms={settings.showBlossoms}>
        <View style={styles.container}>
          <Text style={styles.sessionCompleteText}>Session Complete</Text>
        </View>
      </BlossomBackground>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  const currentStep = exercises[currentStepIndex];
  const nextStep = exercises[currentStepIndex + 1];
  const photoUrl = BW_PHOTOS[hub] || BW_PHOTOS.default;

  // Show 5-second interval screen
  if (showInterval) {
    return (
      <BlossomBackground showBlossoms={settings.showBlossoms} showPaperTexture={false}>
        <View style={styles.container}>
          {/* B&W Photo Background */}
          {settings.showBackgroundPhotos && (
            <ImageBackground
              source={{ uri: photoUrl }}
              style={styles.photoBackground}
              blurRadius={8}
              imageStyle={styles.photoImage}
            />
          )}

          {/* Top-right controls */}
          <View style={styles.controls}>
            {/* Fast Forward Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleFastForwardSingle}
              activeOpacity={0.7}
              accessibilityLabel="Fast forward to skip interval"
              accessibilityRole="button"
            >
              <Text style={styles.controlIcon}>⏩</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleClose}
              activeOpacity={0.7}
              accessibilityLabel="Close exercise"
              accessibilityRole="button"
            >
              <Text style={styles.controlIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.intervalContent, { opacity: fadeAnim }]}>
            <Text style={styles.intervalCountdownText}>
              Next step in {intervalSeconds}...
            </Text>
            {nextStep && (
              <Text style={styles.intervalNextText}>Next: {nextStep.text}</Text>
            )}
            <Text style={styles.intervalTipText}>Tap ⏩ to skip</Text>
          </Animated.View>
        </View>
      </BlossomBackground>
    );
  }

  // Show exercise screen
  return (
    <BlossomBackground showBlossoms={settings.showBlossoms} showPaperTexture={false}>
      <View style={styles.container}>
        {/* B&W Photo Background (blurred, low opacity, desaturated) */}
        {settings.showBackgroundPhotos && (
          <ImageBackground
            source={{ uri: photoUrl }}
            style={styles.photoBackground}
            blurRadius={8}
            imageStyle={styles.photoImage}
          />
        )}

        {/* Top-right controls - 3 icons horizontally aligned */}
        <View style={styles.controls}>
          {/* Slowdown Button */}
          <View style={styles.controlButtonContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleSlowdown}
              activeOpacity={0.7}
              accessibilityLabel={`Slowdown speed, currently ${speedMultiplier}x`}
              accessibilityRole="button"
            >
              <Text style={styles.controlIcon}>⏪</Text>
            </TouchableOpacity>
            <Text style={styles.speedIndicator}>{speedMultiplier}x</Text>
          </View>

          {/* Fast Forward Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleFastForwardPress}
            onLongPress={handleFastForwardLongPress}
            delayLongPress={500}
            activeOpacity={0.7}
            accessibilityLabel="Fast forward to next step"
            accessibilityRole="button"
          >
            <Text style={styles.controlIcon}>⏩</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleClose}
            activeOpacity={0.7}
            accessibilityLabel="Close exercise"
            accessibilityRole="button"
          >
            <Text style={styles.controlIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Large breathing circle */}
          <View style={styles.breathingContainer}>
            {reducedMotion ? (
              <View style={styles.breathingCircleStatic} />
            ) : (
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              />
            )}
          </View>

          {/* Current task label */}
          <Text style={styles.currentTaskLabel}>Current task</Text>

          {/* Task text */}
          <Text style={styles.taskText}>{currentStep.text}</Text>

          {/* Time left */}
          <Text style={styles.timeLeftText}>{remainingSeconds} s left</Text>
        </Animated.View>
      </View>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  photoImage: {
    opacity: PHOTO_OPACITY,
    resizeMode: 'cover',
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: 24,
    flexDirection: 'row',
    gap: 12,
    zIndex: 10,
  },
  controlButtonContainer: {
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  controlIcon: {
    fontSize: 24,
    color: colors.black,
  },
  speedIndicator: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.black,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  intervalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  intervalCountdownText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  intervalNextText: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  intervalTipText: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    opacity: 0.6,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  breathingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: 'transparent',
  },
  breathingCircleStatic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#111',
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  currentTaskLabel: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  taskText: {
    fontSize: 20,
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  timeLeftText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sessionCompleteText: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
  },
});
