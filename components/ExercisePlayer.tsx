
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';

// Step speed constants (in milliseconds)
const STEP_SPEED_NORMAL = 2000; // 2 seconds (1x)
const STEP_SPEED_SLOW1 = 4000; // 4 seconds (2x)
const STEP_SPEED_SLOW2 = 6000; // 6 seconds (3x)
const STEP_SPEED_FAST = 1000; // 1 second (for long press acceleration)
const INTERVAL_DURATION = 5000; // 5 seconds between steps

// B&W motivational photo URLs (Unsplash)
const BW_PHOTOS: Record<string, string> = {
  'stop_smoking': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'move_body': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  'eat_awareness': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'return_calm': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'steady_breath': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80',
  'unplug_refocus': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
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

export default function ExercisePlayer({ hub, exercises, onClose, onComplete }: ExercisePlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.baseDurationSeconds || 2);
  const [showInterval, setShowInterval] = useState(false);
  const [intervalCountdown, setIntervalCountdown] = useState(5);
  const [slowdownLevel, setSlowdownLevel] = useState(0); // 0=1x(2s), 1=2x(4s), 2=3x(6s)
  const [isAccelerated, setIsAccelerated] = useState(false); // Long-press acceleration
  const [showFeedback, setShowFeedback] = useState(false);
  
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Get current step speed based on slowdown level and acceleration
  const getCurrentStepSpeed = () => {
    if (isAccelerated) return STEP_SPEED_FAST;
    
    const baseSpeed = exercises[currentStepIndex]?.baseDurationSeconds || 2;
    const multiplier = slowdownLevel === 0 ? 1 : slowdownLevel === 1 ? 2 : 3;
    return baseSpeed * 1000 * multiplier;
  };

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start breathing animation
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

    // Emit exercise_started event
    emitAnalyticsEvent('exercise_started', {
      hub,
      exercise_id: exercises[0]?.id,
      step_index: 0,
      timestamp: new Date().toISOString(),
    });

    // Auto-start the exercise (within 150ms)
    setTimeout(() => {
      startStep(0);
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

  const startStep = (stepIndex: number) => {
    if (stepIndex >= exercises.length) {
      setShowFeedback(true);
      return;
    }

    const stepSpeed = getCurrentStepSpeed();
    const durationSeconds = Math.ceil(stepSpeed / 1000);
    setTimeLeft(durationSeconds);

    // Clear any existing timer
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    // Countdown timer (updates every second)
    let remaining = durationSeconds;
    stepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

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
      setIntervalCountdown(5);
      startIntervalCountdown(stepIndex + 1);
    } else {
      // No more steps - show feedback or complete
      const duration = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
      
      // Emit exercise_completed event
      emitAnalyticsEvent('exercise_completed', {
        hub,
        exercise_id: exercises[stepIndex]?.id,
        step_index: stepIndex,
        timestamp: new Date().toISOString(),
        duration_seconds: duration,
      });

      // Call onComplete callback
      onComplete({
        completed: true,
        duration_seconds: duration,
        steps_completed: exercises.length,
      });
    }
  };

  const startIntervalCountdown = (nextStepIndex: number) => {
    let countdown = 5;
    setIntervalCountdown(countdown);

    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

    intervalTimerRef.current = setInterval(() => {
      countdown -= 1;
      setIntervalCountdown(countdown);

      if (countdown <= 0) {
        if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
        setShowInterval(false);
        setCurrentStepIndex(nextStepIndex);
        startStep(nextStepIndex);
      }
    }, 1000);
  };

  const handleSlowdown = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const oldSpeed = slowdownLevel;
    const newLevel = (slowdownLevel + 1) % 3;
    setSlowdownLevel(newLevel);

    // Emit analytics event
    emitAnalyticsEvent('exercise_slowdown_changed', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      oldSpeed: oldSpeed === 0 ? '1x' : oldSpeed === 1 ? '2x' : '3x',
      newSpeed: newLevel === 0 ? '1x' : newLevel === 1 ? '2x' : '3x',
    });

    // Restart current step with new speed
    if (!showInterval && !showFeedback) {
      startStep(currentStepIndex);
    }
  };

  const handleFastForwardPress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Handle tap count for double tap detection
    tapCountRef.current += 1;

    if (tapCountRef.current === 1) {
      // First tap - wait for potential second tap
      tapTimerRef.current = setTimeout(() => {
        // Single tap - advance to next step
        handleFastForwardSingle();
        tapCountRef.current = 0;
      }, 300);
    } else if (tapCountRef.current === 2) {
      // Double tap - jump to final step
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      handleFastForwardFinal();
      tapCountRef.current = 0;
    }
  };

  const handleFastForwardSingle = () => {
    // Emit analytics event
    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'single_tap',
    });

    // Skip interval if showing
    if (showInterval) {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      
      // Emit interval_skipped event
      emitAnalyticsEvent('interval_skipped', {
        hub,
        exercise_id: exercises[currentStepIndex]?.id,
        step_index: currentStepIndex,
        timestamp: new Date().toISOString(),
      });

      setShowInterval(false);
      const nextIndex = currentStepIndex + 1;
      
      if (nextIndex >= exercises.length) {
        const duration = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        onComplete({
          completed: true,
          duration_seconds: duration,
          steps_completed: exercises.length,
        });
      } else {
        setCurrentStepIndex(nextIndex);
        startStep(nextIndex);
      }
      return;
    }

    // Clear current timer and advance to next step
    clearAllTimers();
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex >= exercises.length) {
      const duration = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
      onComplete({
        completed: true,
        duration_seconds: duration,
        steps_completed: exercises.length,
      });
    } else {
      // Show interval before next step
      setShowInterval(true);
      setIntervalCountdown(5);
      startIntervalCountdown(nextIndex);
    }
  };

  const handleFastForwardFinal = () => {
    // Emit analytics event
    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'double_tap',
    });

    // Clear all timers and complete
    clearAllTimers();
    setShowInterval(false);
    
    const duration = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
    onComplete({
      completed: true,
      duration_seconds: duration,
      steps_completed: currentStepIndex + 1,
    });
  };

  const handleFastForwardLongPress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Emit analytics event
    emitAnalyticsEvent('exercise_fastforward', {
      hub,
      exercise_id: exercises[currentStepIndex]?.id,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'long_press',
    });

    // Compress subsequent steps to 1s each
    setIsAccelerated(true);

    // Restart current step with fast speed
    if (!showInterval && !showFeedback) {
      startStep(currentStepIndex);
    }
  };

  const handleClose = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    clearAllTimers();
    onClose();
  };

  const emitAnalyticsEvent = (eventName: string, payload: any) => {
    console.log(`[Analytics] ${eventName}:`, payload);
    // TODO: Send to analytics service
  };

  if (exercises.length === 0) {
    return (
      <BlossomBackground showBlossoms={true}>
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

  // Show 5-second interval screen
  if (showInterval) {
    return (
      <BlossomBackground showBlossoms={true} showPaperTexture={false}>
        <View style={styles.container}>
          {/* B&W Photo Background */}
          <ImageBackground
            source={{ uri: BW_PHOTOS[hub] || BW_PHOTOS['default'] }}
            style={styles.photoBackground}
            blurRadius={8}
            imageStyle={styles.photoImage}
          />

          {/* Top-right controls */}
          <View style={styles.controls}>
            {/* Fast Forward Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleFastForwardSingle}
              activeOpacity={0.7}
            >
              <Text style={styles.controlIcon}>⏩</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.controlIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.intervalContent, { opacity: fadeAnim }]}>
            <Text style={styles.intervalCountdownText}>Next step in {intervalCountdown}...</Text>
            {nextStep && (
              <Text style={styles.intervalNextText}>Next: {nextStep.text}</Text>
            )}
          </Animated.View>
        </View>
      </BlossomBackground>
    );
  }

  // Show exercise screen
  return (
    <BlossomBackground showBlossoms={true} showPaperTexture={false}>
      <View style={styles.container}>
        {/* B&W Photo Background (blurred, low opacity, desaturated) */}
        <ImageBackground
          source={{ uri: BW_PHOTOS[hub] || BW_PHOTOS['default'] }}
          style={styles.photoBackground}
          blurRadius={8}
          imageStyle={styles.photoImage}
        />

        {/* Top-right controls - 3 icons horizontally aligned */}
        <View style={styles.controls}>
          {/* Slowdown Button */}
          <TouchableOpacity
            style={[
              styles.controlButton,
              slowdownLevel > 0 && styles.controlButtonActive,
            ]}
            onPress={handleSlowdown}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>⏪</Text>
          </TouchableOpacity>

          {/* Fast Forward Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleFastForwardPress}
            onLongPress={handleFastForwardLongPress}
            delayLongPress={500}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>⏩</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Large breathing circle */}
          <View style={styles.breathingContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          </View>

          {/* Current task label */}
          <Text style={styles.currentTaskLabel}>Current task</Text>

          {/* Task text */}
          <Text style={styles.taskText}>{currentStep.text}</Text>

          {/* Time left */}
          <Text style={styles.timeLeftText}>{timeLeft} s left</Text>
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
    opacity: 0.1, // 8-12% opacity for subtle background
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
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 0, // No rounded corners - plain
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 141, 170, 0.08)', // Very subtle pink highlight
  },
  controlIcon: {
    fontSize: 24,
    color: colors.black,
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
