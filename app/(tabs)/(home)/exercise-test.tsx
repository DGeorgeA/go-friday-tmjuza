
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import ExercisePlayer from '@/components/ExercisePlayer';

// Sample exercises for testing
const sampleExercises = {
  short: [
    { id: 'e1', text: 'Take a deep breath', baseDurationSeconds: 3 },
    { id: 'e2', text: 'Hold for a moment', baseDurationSeconds: 2 },
    { id: 'e3', text: 'Exhale slowly', baseDurationSeconds: 4 },
  ],
  medium: [
    { id: 'e1', text: 'Notice your surroundings', baseDurationSeconds: 5 },
    { id: 'e2', text: 'Feel your feet on the ground', baseDurationSeconds: 5 },
    { id: 'e3', text: 'Observe your breath', baseDurationSeconds: 5 },
    { id: 'e4', text: 'Release any tension', baseDurationSeconds: 5 },
    { id: 'e5', text: 'Return to the present', baseDurationSeconds: 5 },
  ],
  long: [
    { id: 'e1', text: 'Close your eyes gently', baseDurationSeconds: 4 },
    { id: 'e2', text: 'Scan your body from head to toe', baseDurationSeconds: 8 },
    { id: 'e3', text: 'Notice any areas of tension', baseDurationSeconds: 6 },
    { id: 'e4', text: 'Breathe into those areas', baseDurationSeconds: 8 },
    { id: 'e5', text: 'Release with each exhale', baseDurationSeconds: 8 },
    { id: 'e6', text: 'Feel your body relaxing', baseDurationSeconds: 6 },
    { id: 'e7', text: 'Open your eyes slowly', baseDurationSeconds: 4 },
  ],
};

export default function ExerciseTestScreen() {
  const router = useRouter();
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentHub, setCurrentHub] = useState('stop_smoking');
  const [currentExercises, setCurrentExercises] = useState(sampleExercises.short);

  const startExercise = (hub: string, exercises: any[]) => {
    setCurrentHub(hub);
    setCurrentExercises(exercises);
    setShowPlayer(true);
  };

  const handleClose = () => {
    setShowPlayer(false);
  };

  const handleComplete = (summary: any) => {
    console.log('Exercise completed:', summary);
    setShowPlayer(false);
  };

  return (
    <BlossomBackground showBlossoms={true} showPaperTexture={true}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Exercise Player Test Harness</Text>
            <Text style={styles.subtitle}>
              Test all ExercisePlayer features and interactions
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Tests</Text>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('stop_smoking', sampleExercises.short)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Short Session (3 steps)</Text>
              <Text style={styles.testCardDescription}>
                3 steps × 2-4s base = ~9-12s + 2 intervals (10s)
              </Text>
              <Text style={styles.testCardHub}>Hub: Stop Smoking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('move_body', sampleExercises.medium)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Medium Session (5 steps)</Text>
              <Text style={styles.testCardDescription}>
                5 steps × 5s base = 25s + 4 intervals (20s)
              </Text>
              <Text style={styles.testCardHub}>Hub: Move Body</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('return_to_calm', sampleExercises.long)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Long Session (7 steps)</Text>
              <Text style={styles.testCardDescription}>
                7 steps × 4-8s base = ~44s + 6 intervals (30s)
              </Text>
              <Text style={styles.testCardHub}>Hub: Return to Calm</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hub-Specific Tests</Text>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('eat_awareness', sampleExercises.medium)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Eat Awareness</Text>
              <Text style={styles.testCardDescription}>
                Test with food-related background photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('steady_breath', sampleExercises.short)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Steady Breath</Text>
              <Text style={styles.testCardDescription}>
                Test with nature background photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testCard}
              onPress={() => startExercise('unplug_refocus', sampleExercises.medium)}
              activeOpacity={0.8}
            >
              <Text style={styles.testCardTitle}>Unplug & Refocus</Text>
              <Text style={styles.testCardDescription}>
                Test with tech-free background photo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feature Tests</Text>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>⏪ Slowdown Button</Text>
              <Text style={styles.featureDescription}>
                • Tap to cycle: 1x → 2x → 3x → 1x{'\n'}
                • Visual indicator shows current speed{'\n'}
                • Updates remaining seconds mid-step{'\n'}
                • Emits exercise_slowdown_changed event
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>⏩ Fast-Forward Button</Text>
              <Text style={styles.featureDescription}>
                • Single tap: Skip to next step or interval{'\n'}
                • Double tap: Jump to final step{'\n'}
                • Long press (500ms): Compress steps to 1s{'\n'}
                • Emits exercise_fastforward event
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>⏱️ 5-Second Interval</Text>
              <Text style={styles.featureDescription}>
                • Appears between every step{'\n'}
                • Shows countdown: "Next step in 5...4...3..."{'\n'}
                • Displays next task name{'\n'}
                • Can be skipped with Fast-Forward{'\n'}
                • Fixed at 5s (not affected by slowdown)
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>✕ Close Button</Text>
              <Text style={styles.featureDescription}>
                • Promptless exit{'\n'}
                • Returns to previous screen{'\n'}
                • Emits exercise_aborted event
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🎨 Visual Elements</Text>
              <Text style={styles.featureDescription}>
                • B&W photo background (blurred, 10% opacity){'\n'}
                • Pink blossom overlay animation{'\n'}
                • Breathing circle animation{'\n'}
                • All toggleable in Settings
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>♿ Accessibility</Text>
              <Text style={styles.featureDescription}>
                • Respects prefers-reduced-motion{'\n'}
                • All icons have accessibilityLabel{'\n'}
                • Minimum touch target: 44×44px{'\n'}
                • High contrast text
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QA Checklist</Text>

            <View style={styles.checklistCard}>
              <Text style={styles.checklistItem}>
                ✓ Tapping hub opens ExercisePlayer within 150ms
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Top-right shows plain black icons (no colored background)
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Slowdown cycles speeds and updates durations (1x/2x/3x visible)
              </Text>
              <Text style={styles.checklistItem}>
                ✓ 5s interval appears between steps with next task name
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Fast-Forward skips interval and steps
              </Text>
              <Text style={styles.checklistItem}>
                ✓ B&W photo present behind UI (blurred, low opacity)
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Pink blossoms animate above photo
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Settings toggles work (Photos, Blossoms, Fast Gestures)
              </Text>
              <Text style={styles.checklistItem}>
                ✓ All analytics events fire correctly
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Component emits onComplete when done
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Component emits onClose when exited
              </Text>
              <Text style={styles.checklistItem}>
                ✓ Works with prefers-reduced-motion
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[buttonStyles.secondaryButton, { marginTop: 24 }]}
            onPress={() => router.back()}
          >
            <Text style={buttonStyles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>

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
            hub={currentHub}
            exercises={currentExercises}
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
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  testCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  testCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  testCardDescription: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  testCardHub: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.blossomPink,
    letterSpacing: 0.3,
  },
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  checklistCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  checklistItem: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.black,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
