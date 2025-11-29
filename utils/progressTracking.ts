
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';

export interface LocalProgress {
  totalBlossoms: number;
  currentLevel: number;
  completedExercises: Array<{
    hubName: string;
    exerciseName: string;
    exerciseIndex: number;
    rating: number;
    completedAt: string;
  }>;
  exerciseCategories: Record<string, number>;
  streakCounter: number;
  badgesUnlocked: string[];
  lastSyncedAt: string | null;
}

const PROGRESS_KEY = '@gofriday_progress';

// Initialize local progress
export async function initializeLocalProgress(): Promise<LocalProgress> {
  const defaultProgress: LocalProgress = {
    totalBlossoms: 0,
    currentLevel: 1,
    completedExercises: [],
    exerciseCategories: {},
    streakCounter: 0,
    badgesUnlocked: [],
    lastSyncedAt: null,
  };
  
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading local progress:', error);
  }
  
  return defaultProgress;
}

// Save progress locally
export async function saveLocalProgress(progress: LocalProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving local progress:', error);
  }
}

// Get local progress
export async function getLocalProgress(): Promise<LocalProgress> {
  return await initializeLocalProgress();
}

// Update local progress after completing an exercise
export async function updateLocalProgressAfterExercise(
  hubName: string,
  exerciseName: string,
  exerciseIndex: number,
  rating: number,
  blossomsEarned: number
): Promise<void> {
  try {
    const progress = await getLocalProgress();
    
    // Add completed exercise
    progress.completedExercises.push({
      hubName,
      exerciseName,
      exerciseIndex,
      rating,
      completedAt: new Date().toISOString(),
    });
    
    // Update blossoms
    progress.totalBlossoms += blossomsEarned;
    
    // Update exercise categories
    progress.exerciseCategories[hubName] = (progress.exerciseCategories[hubName] || 0) + 1;
    
    // Update level based on blossoms
    progress.currentLevel = calculateLevel(progress.totalBlossoms);
    
    // Update streak (simplified - will be properly calculated on sync)
    const today = new Date().toISOString().split('T')[0];
    const lastExercise = progress.completedExercises[progress.completedExercises.length - 2];
    if (lastExercise) {
      const lastDate = new Date(lastExercise.completedAt).toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        progress.streakCounter += 1;
      } else if (lastDate !== today) {
        progress.streakCounter = 1;
      }
    } else {
      progress.streakCounter = 1;
    }
    
    await saveLocalProgress(progress);
  } catch (error) {
    console.error('Error updating local progress:', error);
  }
}

// Calculate level from blossoms
function calculateLevel(blossoms: number): number {
  if (blossoms >= 2700) return 12;
  if (blossoms >= 2200) return 11;
  if (blossoms >= 1750) return 10;
  if (blossoms >= 1400) return 9;
  if (blossoms >= 1100) return 8;
  if (blossoms >= 850) return 7;
  if (blossoms >= 600) return 6;
  if (blossoms >= 400) return 5;
  if (blossoms >= 250) return 4;
  if (blossoms >= 125) return 3;
  if (blossoms >= 50) return 2;
  return 1;
}

// Sync local progress to Supabase
export async function syncProgressToSupabase(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user logged in, skipping sync');
      return false;
    }
    
    const localProgress = await getLocalProgress();
    
    // Get last synced timestamp
    const lastSynced = localProgress.lastSyncedAt 
      ? new Date(localProgress.lastSyncedAt) 
      : new Date(0);
    
    // Get exercises that haven't been synced
    const unsyncedExercises = localProgress.completedExercises.filter(
      (ex) => new Date(ex.completedAt) > lastSynced
    );
    
    if (unsyncedExercises.length === 0) {
      console.log('No new exercises to sync');
      return true;
    }
    
    // Sync exercises to database
    for (const exercise of unsyncedExercises) {
      await supabase.from('exercises_completed').insert([
        {
          user_id: user.id,
          hub_name: exercise.hubName,
          exercise_name: exercise.exerciseName,
          exercise_index: exercise.exerciseIndex,
          rating: exercise.rating,
          completed_at: exercise.completedAt,
        },
      ]);
    }
    
    // Update last synced timestamp
    localProgress.lastSyncedAt = new Date().toISOString();
    await saveLocalProgress(localProgress);
    
    console.log(`Synced ${unsyncedExercises.length} exercises to Supabase`);
    return true;
  } catch (error) {
    console.error('Error syncing progress:', error);
    return false;
  }
}

// Load progress from Supabase and merge with local
export async function loadProgressFromSupabase(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user logged in, skipping load');
      return;
    }
    
    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!profile) {
      console.log('No profile found');
      return;
    }
    
    // Get all exercises
    const { data: exercises } = await supabase
      .from('exercises_completed')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: true });
    
    // Get all badges
    const { data: badges } = await supabase
      .from('badges')
      .select('badge_id')
      .eq('user_id', user.id);
    
    // Build exercise categories
    const exerciseCategories: Record<string, number> = {};
    exercises?.forEach((ex) => {
      exerciseCategories[ex.hub_name] = (exerciseCategories[ex.hub_name] || 0) + 1;
    });
    
    // Update local progress
    const progress: LocalProgress = {
      totalBlossoms: profile.blossoms || 0,
      currentLevel: profile.level || 1,
      completedExercises: exercises?.map((ex) => ({
        hubName: ex.hub_name,
        exerciseName: ex.exercise_name,
        exerciseIndex: ex.exercise_index,
        rating: ex.rating || 0,
        completedAt: ex.completed_at,
      })) || [],
      exerciseCategories,
      streakCounter: profile.streak || 0,
      badgesUnlocked: badges?.map((b) => b.badge_id) || [],
      lastSyncedAt: new Date().toISOString(),
    };
    
    await saveLocalProgress(progress);
    console.log('Progress loaded from Supabase');
  } catch (error) {
    console.error('Error loading progress from Supabase:', error);
  }
}

// Clear local progress (for logout)
export async function clearLocalProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
    console.log('Local progress cleared');
  } catch (error) {
    console.error('Error clearing local progress:', error);
  }
}
