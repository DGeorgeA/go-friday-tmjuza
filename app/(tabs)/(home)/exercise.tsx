
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';
import { awardBlossoms, checkFirstExerciseOfDay, checkHubSequenceCompletion, updateStreak } from '@/utils/blossomRewards';
import { checkAndAwardBadges } from '@/utils/badgeSystem';
import { updateLocalProgressAfterExercise, syncProgressToSupabase } from '@/utils/progressTracking';

const STEP_DURATION = 2000; // 2 seconds per step

export default function ExerciseScreen() {
  const router = useRouter();
  const { hubId, exerciseIndex } = useLocalSearchParams();
  const hub = impulseHubs[hubId as ImpulseType];
  const exercise = hub?.exercises[Number(exerciseIndex)];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blossomAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Start blossom animations
    blossomAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 4000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 4000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

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

    // Auto-start the exercise
    startAutoProgress();

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, []);

  const startAutoProgress = () => {
    if (!exercise) return;
    
    stepTimerRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep >= exercise.steps.length) {
          setShowFeedback(true);
          return prev;
        }
        if (!isPaused) {
          startAutoProgress();
        }
        return nextStep;
      });
    }, STEP_DURATION);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    if (isPaused) {
      startAutoProgress();
    }
  };

  const handleFastForward = () => {
    if (!exercise) return;
    
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    
    setCurrentStep((prev) => {
      const nextStep = prev + 1;
      if (nextStep >= exercise.steps.length) {
        setShowFeedback(true);
        return prev;
      }
      if (!isPaused) {
        startAutoProgress();
      }
      return nextStep;
    });
  };

  const handleClose = () => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
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
        
        // Check if user completed all 5 exercises in this hub
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

  const handleTapToExit = () => {
    handleClose();
  };

  if (!exercise) {
    return (
      <BlossomBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Exercise not found</Text>
        </View>
      </BlossomBackground>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.6],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  if (showFeedback) {
    return (
      <BlossomBackground>
        <TouchableOpacity 
          style={styles.container} 
          activeOpacity={1}
          onPress={() => {}}
        >
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
          </Animated.View>
        </TouchableOpacity>
      </BlossomBackground>
    );
  }

  return (
    <BlossomBackground>
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={1}
        onPress={handleTapToExit}
      >
        {/* Top-right controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              handlePause();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol
              android_material_icon_name={isPaused ? 'play-arrow' : 'pause'}
              ios_icon_name={isPaused ? 'play.fill' : 'pause.fill'}
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              handleFastForward();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol
              android_material_icon_name="fast-forward"
              ios_icon_name="forward.fill"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            activeOpacity={0.7}
          >
            <IconSymbol
              android_material_icon_name="close"
              ios_icon_name="xmark"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>

        {/* Grayscale blossom particles */}
        {blossomAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.blossomParticle,
              {
                left: `${(index * 15) % 90}%`,
                top: `${(index * 12) % 80}%`,
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.05, 0.1, 0.05],
                }),
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.particleShape} />
          </Animated.View>
        ))}

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

          {/* Instruction text */}
          <Text style={styles.instructionText}>
            {exercise.steps[currentStep]}
          </Text>

          {/* Credit at bottom */}
          <Text style={styles.creditText}>
            Source: {exercise.credit}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 80,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: 'transparent',
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
    marginBottom: 40,
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
  blossomParticle: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  particleShape: {
    width: 30,
    height: 30,
    backgroundColor: colors.blossomGray,
    borderRadius: 15,
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
  },
  errorText: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
  },
});
