
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

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
      <BlossomBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Intervention not found</Text>
        </View>
      </BlossomBackground>
    );
  }

  const scale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const opacity = breatheAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.4, 1, 0.4],
  });

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
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
                <View style={styles.breathingInner} />
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
                    <Text style={styles.navButtonText}>← Prev</Text>
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
              onPress={() => {
                if (timeRemaining === 0) {
                  setTimeRemaining(intervention.duration);
                }
                setIsPlaying(!isPlaying);
              }}
            >
              <Text style={buttonStyles.primaryButtonText}>
                {isPlaying ? 'Pause' : timeRemaining === 0 ? 'Restart' : 'Start'}
              </Text>
            </TouchableOpacity>

            {timeRemaining === 0 && (
              <View style={styles.completionCard}>
                <Text style={styles.completionText}>Well done!</Text>
                <Text style={styles.completionSubtext}>
                  You&apos;ve completed this intervention
                </Text>
              </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.black,
  },
  scriptContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scriptText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 13,
    color: colors.black,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  playButton: {
    marginTop: 16,
  },
  completionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completionText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  completionSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 15,
    color: colors.black,
    textAlign: 'center',
  },
});
