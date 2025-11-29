
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';
import BlossomBackground from '@/components/BlossomBackground';

export default function InterventionScreen() {
  const router = useRouter();
  const { impulseId, tierIndex } = useLocalSearchParams();
  const hub = impulseHubs[impulseId as ImpulseType];
  const intervention = hub?.interventions[Number(tierIndex)];

  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(intervention?.duration || 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blossomAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

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
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setShowFeedback(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
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
    } else {
      breatheAnim.stopAnimation();
    }
  }, [isPlaying]);

  const handleFeedback = (rating: number) => {
    console.log('User feedback:', rating);
    // Auto-save and return to home
    router.push('/(tabs)/(home)/' as any);
  };

  const handleTapToExit = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      router.back();
    }
  };

  if (!intervention) {
    return (
      <BlossomBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Intervention not found</Text>
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
              {[1, 2, 3, 4, 5].map((rating, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.dot}
                    onPress={() => handleFeedback(rating)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dotInner} />
                  </TouchableOpacity>
                </React.Fragment>
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
        {/* Grayscale blossom particles */}
        {blossomAnims.map((anim, index) => (
          <React.Fragment key={index}>
            <Animated.View
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
          </React.Fragment>
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
            {intervention.script && intervention.script[currentStep]}
          </Text>

          {/* Small exit hint */}
          <Text style={styles.exitHint}>Tap anywhere to {isPlaying ? 'pause' : 'exit'}</Text>
        </Animated.View>

        {/* Start button (only shown when not playing) */}
        {!isPlaying && timeRemaining > 0 && (
          <View style={styles.startButtonContainer}>
            <TouchableOpacity
              style={buttonStyles.secondaryButton}
              onPress={(e) => {
                e.stopPropagation();
                setIsPlaying(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.secondaryButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.3,
    marginBottom: 40,
  },
  exitHint: {
    fontSize: 12,
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
  startButtonContainer: {
    position: 'absolute',
    bottom: 120,
    left: 32,
    right: 32,
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
