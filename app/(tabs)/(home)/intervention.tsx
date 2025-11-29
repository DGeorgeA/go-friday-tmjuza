
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';

export default function InterventionScreen() {
  const router = useRouter();
  const { impulseId, tierIndex } = useLocalSearchParams();
  const hub = impulseHubs[impulseId as ImpulseType];
  const intervention = hub?.interventions[Number(tierIndex)];

  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(intervention?.duration || 60);
  const [isPlaying, setIsPlaying] = useState(false);
  
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
    if (isPlaying) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
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
    }
  }, [isPlaying]);

  const handleNext = () => {
    if (intervention?.script && currentStep < intervention.script.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!intervention) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Intervention not found</Text>
      </View>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

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
          <Text style={styles.title}>{intervention.title}</Text>
          <Text style={styles.subtitle}>{intervention.description}</Text>
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

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
        </View>

        {intervention.script && (
          <View style={styles.scriptContainer}>
            <Text style={styles.scriptText}>
              {intervention.script[currentStep]}
            </Text>
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentStep === 0}
              >
                <Text style={styles.navButtonText}>← Previous</Text>
              </TouchableOpacity>
              <Text style={styles.stepIndicator}>
                {currentStep + 1} / {intervention.script.length}
              </Text>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentStep === intervention.script.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={handleNext}
                disabled={currentStep === intervention.script.length - 1}
              >
                <Text style={styles.navButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[buttonStyles.primaryButton, styles.playButton]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={buttonStyles.primaryButtonText}>
            {isPlaying ? 'Pause' : timeRemaining === 0 ? 'Restart' : 'Start'}
          </Text>
        </TouchableOpacity>

        {timeRemaining === 0 && (
          <View style={styles.completionCard}>
            <Text style={styles.completionEmoji}>✨</Text>
            <Text style={styles.completionText}>Well done!</Text>
            <Text style={styles.completionSubtext}>
              You&apos;ve completed this intervention
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.charcoal,
  },
  scriptContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    minHeight: 120,
  },
  scriptText: {
    fontSize: 18,
    color: colors.charcoal,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 14,
    color: colors.warmPink,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.6,
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
