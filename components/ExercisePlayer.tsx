
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
  Modal,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Timing constants (in milliseconds)
const STEP_BASE_MS = 5000; // 5 seconds base (increased from 2 seconds)
const INTERVAL_DURATION_MS = 5000; // 5 seconds interval between tasks
const ACCENT_PINK = '#FF8DAA';
const PHOTO_OPACITY = 0.10;

// B&W motivational photo URLs (Unsplash - optimized)
const BW_PHOTOS: Record<string, string> = {
  'stop-smoking': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&sat=-100',
  'move-body': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&sat=-100',
  'eat-awareness': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&sat=-100',
  'return-calm': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&sat=-100',
  'steady-breath': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80&sat=-100',
  'stop-doomscrolling': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80&sat=-100',
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

// Completion Popup Component with Heavy Falling Leaves
function CompletionPopup({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  const blossomAnims = useRef([...Array(30)].map(() => ({
    translateY: new Animated.Value(-100),
    translateX: new Animated.Value(0),
    rotate: new Animated.Value(0),
    scale: new Animated.Value(1),
    opacity: new Animated.Value(0),
  }))).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in the popup
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start heavy falling leaves animation
      blossomAnims.forEach((anim, index) => {
        const delay = index * 100; // Stagger the start
        const duration = 3000 + Math.random() * 2000; // 3-5 seconds
        const horizontalDrift = (Math.random() - 0.5) * 200; // Random horizontal movement

        setTimeout(() => {
          Animated.parallel([
            // Falling animation
            Animated.timing(anim.translateY, {
              toValue: 1000,
              duration,
              useNativeDriver: true,
            }),
            // Horizontal drift
            Animated.timing(anim.translateX, {
              toValue: horizontalDrift,
              duration,
              useNativeDriver: true,
            }),
            // Rotation animation
            Animated.timing(anim.rotate, {
              toValue: 360 + Math.random() * 360,
              duration,
              useNativeDriver: true,
            }),
            // Scale animation
            Animated.sequence([
              Animated.timing(anim.scale, {
                toValue: 1.2,
                duration: duration / 2,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.8,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ]),
            // Opacity animation
            Animated.sequence([
              Animated.timing(anim.opacity, {
                toValue: 0.9,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.9,
                duration: duration - 600,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        }, delay);
      });

      // Auto-dismiss after 5 seconds
      const dismissTimer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => {
        clearTimeout(dismissTimer);
      };
    }
  }, [visible, blossomAnims, fadeAnim, onDismiss]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={completionStyles.overlay}>
        {/* Heavy falling pink leaves */}
        {blossomAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              completionStyles.blossomLeaf,
              {
                left: `${(index * 7) % 100}%`,
                top: -50,
                opacity: anim.opacity,
                transform: [
                  { translateY: anim.translateY },
                  { translateX: anim.translateX },
                  {
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                  { scale: anim.scale },
                ],
              },
            ]}
          >
            {/* Sakura petal shape */}
            <View style={completionStyles.petalContainer}>
              <View style={[completionStyles.petal, completionStyles.petal1]} />
              <View style={[completionStyles.petal, completionStyles.petal2]} />
              <View style={[completionStyles.petal, completionStyles.petal3]} />
              <View style={[completionStyles.petal, completionStyles.petal4]} />
              <View style={[completionStyles.petal, completionStyles.petal5]} />
            </View>
          </Animated.View>
        ))}

        {/* Completion message */}
        <Animated.View style={[completionStyles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={completionStyles.messageText}>
            衝動を蹴り飛ばし、{'\n'}
            悟りの道を歩んでいます
          </Text>
          <Text style={completionStyles.messageSubtext}>
            You are on your path of enlightenment{'\n'}
            by kicking your Impulses hard below belt
          </Text>
        </Animated.View>

        {/* Tap to dismiss */}
        <TouchableOpacity
          style={completionStyles.dismissButton}
          onPress={onDismiss}
          activeOpacity={0.7}
        >
          <Text style={completionStyles.dismissText}>Tap to continue</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const completionStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blossomLeaf: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  petalContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 16,
    height: 24,
    backgroundColor: ACCENT_PINK,
    borderRadius: 16,
  },
  petal1: {
    top: 0,
    left: 12,
  },
  petal2: {
    top: 8,
    left: 24,
    transform: [{ rotate: '72deg' }],
  },
  petal3: {
    top: 24,
    left: 20,
    transform: [{ rotate: '144deg' }],
  },
  petal4: {
    top: 24,
    left: 4,
    transform: [{ rotate: '216deg' }],
  },
  petal5: {
    top: 8,
    left: 0,
    transform: [{ rotate: '288deg' }],
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  messageText: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 48,
    marginBottom: 32,
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'Noto Sans JP',
  },
  messageSubtext: {
    fontSize: 18,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  dismissButton: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
});

export default function ExercisePlayer({
  hub,
  exercises,
  onClose,
  onComplete,
}: ExercisePlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1, 2, or 3
  const [remainingSeconds, setRemainingSeconds] = useState(exercises[0]?.baseDurationSeconds || 5);
  const [isInInterval, setIsInInterval] = useState(false);
  const [intervalRemaining, setIntervalRemaining] = useState(5);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
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
    const startTimer = setTimeout(() => {
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
      clearTimeout(startTimer);
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
  };

  const getCurrentDuration = (stepIndex: number): number => {
    const baseSeconds = exercises[stepIndex]?.baseDurationSeconds || 5;
    return baseSeconds * speedMultiplier;
  };

  const startStep = (stepIdx: number) => {
    if (stepIdx >= exercises.length) {
      handleSessionComplete();
      return;
    }

    setStepIndex(stepIdx);
    setIsInInterval(false);

    const durationSeconds = getCurrentDuration(stepIdx);
    setRemainingSeconds(durationSeconds);

    // Clear any existing timer
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    // Countdown timer (updates every second)
    let remaining = durationSeconds;
    stepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        handleStepComplete(stepIdx);
      }
    }, 1000);
  };

  const handleStepComplete = (stepIdx: number) => {
    // Check if there's a next step
    if (stepIdx + 1 < exercises.length) {
      // Enter 5-second interval
      startInterval(stepIdx + 1);
    } else {
      // No more steps - complete session
      handleSessionComplete();
    }
  };

  const startInterval = (nextStepIdx: number) => {
    setIsInInterval(true);
    setIntervalRemaining(5);

    // Clear any existing timer
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

    let remaining = 5;
    intervalTimerRef.current = setInterval(() => {
      remaining -= 1;
      setIntervalRemaining(remaining);

      if (remaining <= 0) {
        if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
        // Auto-advance to next step
        startStep(nextStepIdx);
      }
    }, 1000);
  };

  const handleSessionComplete = () => {
    clearAllTimers();
    const duration = Math.floor(
      (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000
    );

    setShowCompletionPopup(true);

    emitAnalyticsEvent('exercise_completed', {
      hub,
      totalSteps: exercises.length,
      duration,
      timestamp: new Date().toISOString(),
    });

    // Haptic feedback for completion
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleCompletionDismiss = () => {
    setShowCompletionPopup(false);
    onComplete({
      completed: true,
      duration_seconds: Math.floor(
        (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000
      ),
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
      exercise_id: exercises[stepIndex]?.id,
      step_index: stepIndex,
      oldSpeed: `${oldSpeed}x`,
      newSpeed: `${newSpeed}x`,
      timestamp: new Date().toISOString(),
    });

    // Update remaining seconds to new duration
    const newDuration = getCurrentDuration(stepIndex);
    setRemainingSeconds(newDuration);

    // Restart timer with new duration
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    let remaining = newDuration;
    stepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        handleStepComplete(stepIndex);
      }
    }, 1000);
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
    if (isInInterval) {
      // Skip interval and go to next step
      emitAnalyticsEvent('interval_skipped', {
        hub,
        next_exercise_id: exercises[stepIndex]?.id,
        timestamp: new Date().toISOString(),
      });

      clearAllTimers();
      startStep(stepIndex);
    } else {
      // Skip current step
      emitAnalyticsEvent('exercise_fastforward', {
        hub,
        exercise_id: exercises[stepIndex]?.id,
        fromStep: stepIndex,
        toStep: stepIndex + 1,
        timestamp: new Date().toISOString(),
      });

      clearAllTimers();
      
      if (stepIndex + 1 < exercises.length) {
        // Enter interval before next step
        startInterval(stepIndex + 1);
      } else {
        // Complete session
        handleSessionComplete();
      }
    }
  };

  const handleFastForwardDouble = () => {
    if (!settings.fastGesturesEnabled) return;

    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[stepIndex]?.id,
      fromStep: stepIndex,
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
      exercise_id: exercises[stepIndex]?.id,
      fromStep: stepIndex,
      toStep: 'accelerated',
      action: 'long_press',
      timestamp: new Date().toISOString(),
    });

    // Set speed to 1 second per step
    setSpeedMultiplier(0.5); // This will make steps very fast

    // Restart current step with fast duration
    const newDuration = 1;
    setRemainingSeconds(newDuration);

    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    let remaining = newDuration;
    stepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
        handleStepComplete(stepIndex);
      }
    }, 1000);
  };

  const handleClose = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    emitAnalyticsEvent('exercise_aborted', {
      hub,
      exercise_id: exercises[stepIndex]?.id,
      step_index: stepIndex,
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
      <View style={styles.container}>
        <Text style={styles.sessionCompleteText}>Session Complete</Text>
      </View>
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

  const currentStep = exercises[stepIndex];
  const nextStep = stepIndex + 1 < exercises.length ? exercises[stepIndex + 1] : null;
  const photoUrl = BW_PHOTOS[hub] || BW_PHOTOS.default;

  // Show interval screen
  if (isInInterval) {
    return (
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
            onPress={handleFastForwardPress}
            activeOpacity={0.7}
            accessibilityLabel="Skip interval"
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
          {/* Interval countdown */}
          <Text style={styles.intervalText}>Next step in {intervalRemaining}...</Text>
          {nextStep && (
            <Text style={styles.nextTaskText}>Next: {nextStep.text}</Text>
          )}
          <Text style={styles.skipHintText}>Tap ⏩ to skip</Text>
        </Animated.View>
      </View>
    );
  }

  // Show exercise screen
  return (
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

      {/* Completion Popup */}
      <CompletionPopup
        visible={showCompletionPopup}
        onDismiss={handleCompletionDismiss}
      />

      {/* Top-right controls - Minimalistic Japanese style */}
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

        {/* Task text - ENLARGED */}
        <Text style={styles.taskText}>{currentStep.text}</Text>

        {/* Time left */}
        <Text style={styles.timeLeftText}>{remainingSeconds} s left</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    gap: 16,
    zIndex: 10,
  },
  controlButtonContainer: {
    alignItems: 'center',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  controlIcon: {
    fontSize: 22,
    color: colors.black,
    fontWeight: '300',
  },
  speedIndicator: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
    borderWidth: 1.5,
    borderColor: colors.black,
    backgroundColor: 'transparent',
  },
  breathingCircleStatic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: colors.black,
    backgroundColor: 'transparent',
    opacity: 0.7,
  },
  currentTaskLabel: {
    fontSize: 11,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  taskText: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: 0.5,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  timeLeftText: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  intervalText: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  nextTaskText: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  skipHintText: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    opacity: 0.6,
  },
  sessionCompleteText: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
  },
});
