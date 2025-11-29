
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulses, impulseHubs } from '@/data/impulses';
import { ImpulseType } from '@/types/impulse';
import BlossomBackground from '@/components/BlossomBackground';
import ExercisePlayer from '@/components/ExercisePlayer';
import { IconSymbol } from '@/components/IconSymbol';

export default function HubDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const impulseId = id as ImpulseType;

  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0);

  const impulse = impulses.find((i) => i.id === impulseId);
  const hub = impulseHubs[impulseId];

  if (!impulse || !hub) {
    return (
      <BlossomBackground showBlossoms={true} showPaperTexture={true}>
        <View style={styles.container}>
          <Text style={styles.errorText}>Hub not found</Text>
        </View>
      </BlossomBackground>
    );
  }

  const startExercise = (exerciseIndex: number) => {
    setSelectedExerciseIndex(exerciseIndex);
    setShowPlayer(true);
  };

  const handleClose = () => {
    setShowPlayer(false);
  };

  const handleComplete = (summary: any) => {
    console.log('Exercise completed:', summary);
    setShowPlayer(false);
    // TODO: Update user progress, award blossoms, etc.
  };

  // Convert exercise steps to ExercisePlayer format
  const getExerciseSteps = (exerciseIndex: number) => {
    const exercise = hub.exercises[exerciseIndex];
    return exercise.steps.map((step, index) => ({
      id: `${exercise.name}_step_${index}`,
      text: step,
      baseDurationSeconds: 5, // Default 5 seconds per step
    }));
  };

  return (
    <BlossomBackground showBlossoms={true} showPaperTexture={true}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={colors.black}
            />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <IconSymbol
              ios_icon_name="circle.fill"
              android_material_icon_name={impulse.icon}
              size={64}
              color={colors.black}
            />
            <Text style={styles.title}>{impulse.name}</Text>
            <Text style={styles.description}>{impulse.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <Text style={styles.sectionSubtitle}>
              Tap any exercise to begin immediately
            </Text>

            {hub.exercises.map((exercise, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exerciseCard}
                onPress={() => startExercise(index)}
                activeOpacity={0.8}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseStepCount}>
                    {exercise.steps.length} steps
                  </Text>
                </View>
                <Text style={styles.exerciseCredit}>by {exercise.credit}</Text>
                <View style={styles.exerciseStepsPreview}>
                  <Text style={styles.exerciseStepsPreviewText}>
                    {exercise.steps[0]}
                  </Text>
                  {exercise.steps.length > 1 && (
                    <Text style={styles.exerciseStepsMore}>
                      +{exercise.steps.length - 1} more steps
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Exercise Player Modal */}
        <Modal
          visible={showPlayer}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleClose}
        >
          <ExercisePlayer
            hub={impulseId}
            exercises={getExerciseSteps(selectedExerciseIndex)}
            onClose={handleClose}
            onComplete={handleComplete}
          />
        </Modal>
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
    paddingBottom: 140,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  exerciseCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.2,
    flex: 1,
  },
  exerciseStepCount: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  exerciseCredit: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  exerciseStepsPreview: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseStepsPreviewText: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.black,
    lineHeight: 20,
    marginBottom: 4,
  },
  exerciseStepsMore: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.blossomPink,
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});
