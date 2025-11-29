
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { breathingPatterns } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';

export default function BreathingScreen() {
  const router = useRouter();
  const { patternId } = useLocalSearchParams();
  const pattern = breathingPatterns.find(p => p.id === patternId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
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
              setShowFeedback(true);
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

  const handleFeedback = (rating: number) => {
    console.log('User feedback:', rating);
    router.push('/(tabs)/(home)/' as any);
  };

  const handleTapToExit = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      router.back();
    }
  };

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
    outputRange: [1, 1.6],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
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
          <Text style={styles.instructionText}>{getPhaseText()}</Text>

          {/* Small exit hint */}
          <Text style={styles.exitHint}>Tap anywhere to {isPlaying ? 'pause' : 'exit'}</Text>
        </Animated.View>

        {/* Start button (only shown when not playing) */}
        {!isPlaying && currentCycle === 0 && (
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
