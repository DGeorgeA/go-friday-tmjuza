
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground, AccessibilityInfo, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import { impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';
import { supabase } from '@/app/integrations/supabase/client';
import { awardBlossoms, checkFirstExerciseOfDay, checkHubSequenceCompletion, updateStreak } from '@/utils/blossomRewards';
import { checkAndAwardBadges } from '@/utils/badgeSystem';
import { updateLocalProgressAfterExercise, syncProgressToSupabase } from '@/utils/progressTracking';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Step speed constants (in milliseconds)
const STEP_SPEED_NORMAL = 2000; // 2 seconds (1x)
const STEP_SPEED_SLOW1 = 4000; // 4 seconds (2x)
const STEP_SPEED_SLOW2 = 6000; // 6 seconds (3x)
const STEP_SPEED_FAST = 1000; // 1 second (for long press acceleration)
const ACCENT_PINK = '#FF8DAA';

// B&W motivational photo URLs (Unsplash)
const BW_PHOTOS: Record<string, string> = {
  'stop-smoking': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Mountain landscape
  'move-body': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', // Mountain path
  'eat-awareness': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', // Forest path
  'return-calm': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', // Nature landscape
  'steady-breath': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80', // Nature scene
  'unplug-refocus': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80', // Calm interior
};

interface ExerciseStep {
  id: string;
  text: string;
  baseDurationSeconds?: number;
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
    }
  }, [visible]);

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
    fontSize: 28,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 42,
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Hiragino Sans' : 'Noto Sans JP',
  },
  messageSubtext: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  dismissButton: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
});

export default function ExerciseScreen() {
  const router = useRouter();
  const { hubId, exerciseIndex } = useLocalSearchParams();
  const hub = impulseHubs[hubId as ImpulseType];
  const exercise = hub?.exercises[Number(exerciseIndex)];

  // Convert exercise steps to ExerciseStep format
  const exercises: ExerciseStep[] = exercise?.steps.map((step, idx) => ({
    id: `step-${idx}`,
    text: step,
    baseDurationSeconds: 2, // Default 2 seconds
  })) || [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercises[0]?.baseDurationSeconds || 2);
  const [slowdownLevel, setSlowdownLevel] = useState(0); // 0=1x(2s), 1=2x(4s), 2=3x(6s)
  const [isAccelerated, setIsAccelerated] = useState(false); // Long-press acceleration
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [showBlossoms, setShowBlossoms] = useState(true);
  const [showBackgroundPhotos, setShowBackgroundPhotos] = useState(true);
  
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    loadSettings();
    
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
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: 0,
      timestamp: new Date().toISOString(),
    });

    // Auto-start the exercise
    startStep(0);

    return () => {
      clearAllTimers();
    };
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('@gofriday_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setShowBlossoms(parsed.showBlossoms !== false);
        setShowBackgroundPhotos(parsed.showBackgroundPhotos !== false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const clearAllTimers = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
  };

  const startStep = (stepIndex: number) => {
    if (stepIndex >= exercises.length) {
      handleExerciseComplete();
      return;
    }

    setCurrentStepIndex(stepIndex);
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
    // Check if there's a next step - NO MORE 5-SECOND INTERVAL
    if (stepIndex + 1 < exercises.length) {
      // Directly start next step
      startStep(stepIndex + 1);
    } else {
      // No more steps - show completion popup
      handleExerciseComplete();
    }
  };

  const handleExerciseComplete = () => {
    clearAllTimers();
    setShowCompletionPopup(true);
    
    // Emit exercise_completed event
    emitAnalyticsEvent('exercise_completed', {
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      duration_seconds: Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000),
    });

    // Haptic feedback for completion
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Auto-dismiss after 5 seconds and show feedback
    setTimeout(() => {
      setShowCompletionPopup(false);
      setShowFeedback(true);
    }, 5000);
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
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      oldSpeed: oldSpeed === 0 ? '1x' : oldSpeed === 1 ? '2x' : '3x',
      newSpeed: newLevel === 0 ? '1x' : newLevel === 1 ? '2x' : '3x',
    });

    // Restart current step with new speed
    if (!showFeedback && !showCompletionPopup) {
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
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'single_tap',
    });

    // Clear current timer and advance to next step
    clearAllTimers();
    const nextIndex = currentStepIndex + 1;
    
    if (nextIndex >= exercises.length) {
      handleExerciseComplete();
    } else {
      // Directly start next step (no interval)
      startStep(nextIndex);
    }
  };

  const handleFastForwardFinal = () => {
    // Emit analytics event
    emitAnalyticsEvent('exercise_fastforward', {
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'double_tap',
    });

    // Clear all timers and jump to completion
    clearAllTimers();
    handleExerciseComplete();
  };

  const handleFastForwardLongPress = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Emit analytics event
    emitAnalyticsEvent('exercise_fastforward', {
      hub: hubId,
      exercise_id: exercise?.name,
      step_index: currentStepIndex,
      timestamp: new Date().toISOString(),
      action: 'long_press',
    });

    // Compress subsequent steps to 1s each
    setIsAccelerated(true);

    // Restart current step with fast speed
    if (!showFeedback && !showCompletionPopup) {
      startStep(currentStepIndex);
    }
  };

  const handleClose = () => {
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    clearAllTimers();
    router.back();
  };

  const handleFeedback = async (rating: number) => {
    console.log('User feedback:', rating);
    
    // Save exercise completion to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Calculate blossoms earned
      let blossomsEarned = 5; // Base for completing exercise
      
      if (user) {
        // Check if this is first exercise of the day
        const isFirstToday = await checkFirstExerciseOfDay(user.id);
        if (isFirstToday) {
          blossomsEarned += 15; // First exercise of the day bonus
        }
        
        // Save exercise completion
        await supabase.from('exercises_completed').insert([
          {
            user_id: user.id,
            hub_name: hubId as string,
            exercise_name: exercise?.name || '',
            exercise_index: Number(exerciseIndex),
            rating,
            blossoms_earned: blossomsEarned,
          },
        ]);
        
        // Award blossoms
        await awardBlossoms(user.id, blossomsEarned, `Completed ${exercise?.name}`);
        
        // Update streak
        await updateStreak(user.id);
        
        // Check if user completed all exercises in this hub
        const isSequenceComplete = await checkHubSequenceCompletion(user.id, hubId as string);
        
        if (isSequenceComplete) {
          // Check if we already recorded this sequence completion
          const { data: existingSequence } = await supabase
            .from('hub_sequences_completed')
            .select('*')
            .eq('user_id', user.id)
            .eq('hub_name', hubId as string)
            .limit(1);
          
          if (!existingSequence || existingSequence.length === 0) {
            // Award sequence completion bonus
            await supabase.from('hub_sequences_completed').insert([
              {
                user_id: user.id,
                hub_name: hubId as string,
                blossoms_earned: 10,
              },
            ]);
            
            await awardBlossoms(user.id, 10, `Completed all exercises in ${hubId}`);
          }
        }
        
        // Check and award badges
        await checkAndAwardBadges(user.id);
        
        // Sync progress to Supabase
        await syncProgressToSupabase();
      } else {
        // User not logged in - save locally only
        await updateLocalProgressAfterExercise(
          hubId as string,
          exercise?.name || '',
          Number(exerciseIndex),
          rating,
          blossomsEarned
        );
      }
    } catch (error) {
      console.error('Error saving exercise completion:', error);
      
      // Fallback to local storage
      await updateLocalProgressAfterExercise(
        hubId as string,
        exercise?.name || '',
        Number(exerciseIndex),
        rating,
        5
      );
    }
    
    // Return to home
    router.push('/(tabs)/(home)/' as any);
  };

  const emitAnalyticsEvent = (eventName: string, payload: any) => {
    console.log(`[Analytics] ${eventName}:`, payload);
    // TODO: Send to analytics service
  };

  if (!exercise || exercises.length === 0) {
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

  const currentStep = exercises[currentStepIndex];

  // Show feedback screen
  if (showFeedback) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackQuestion}>How do you feel now?</Text>
          <View style={styles.dotsContainer}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={styles.dot}
                onPress={() => handleFeedback(rating)}
                activeOpacity={0.7}
              >
                <View style={styles.dotInner} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.feedbackHint}>Tap a dot to save</Text>
          <Text style={styles.creditText}>
            Exercise adapted from: {exercise.credit}
          </Text>
        </Animated.View>
      </View>
    );
  }

  // Show exercise screen
  return (
    <View style={styles.container}>
      {/* B&W Photo Background (blurred, low opacity, desaturated) */}
      {showBackgroundPhotos && (
        <ImageBackground
          source={{ uri: BW_PHOTOS[hubId as string] || BW_PHOTOS['stop-smoking'] }}
          style={styles.photoBackground}
          blurRadius={8}
          imageStyle={styles.photoImage}
        />
      )}

      {/* Completion Popup */}
      <CompletionPopup
        visible={showCompletionPopup}
        onDismiss={() => {
          setShowCompletionPopup(false);
          setShowFeedback(true);
        }}
      />

      {/* Top-right controls - Minimalistic Japanese style */}
      <View style={styles.controls}>
        {/* Slowdown Button */}
        <View style={styles.controlButtonContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSlowdown}
            activeOpacity={0.7}
          >
            <Text style={styles.controlIcon}>⏪</Text>
          </TouchableOpacity>
          <Text style={styles.speedIndicator}>
            {slowdownLevel === 0 ? '1x' : slowdownLevel === 1 ? '2x' : '3x'}
          </Text>
        </View>

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
    opacity: 0.1, // 8-12% opacity for subtle background
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
    borderRadius: 0, // No rounded corners - minimalistic
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
    fontSize: 20,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
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
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  feedbackQuestion: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.black,
  },
  feedbackHint: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 60,
  },
  creditText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sessionCompleteText: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
  },
});
