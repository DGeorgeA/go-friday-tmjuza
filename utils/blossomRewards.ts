
import { supabase } from '@/app/integrations/supabase/client';

export interface BlossomReward {
  amount: number;
  reason: string;
}

export async function awardBlossoms(userId: string, amount: number, reason: string): Promise<boolean> {
  try {
    // Get current blossom count
    const { data: profile } = await supabase
      .from('profiles')
      .select('blossoms')
      .eq('id', userId)
      .single();
    
    if (!profile) {
      console.error('Profile not found');
      return false;
    }
    
    // Update blossom count
    const { error } = await supabase
      .from('profiles')
      .update({ blossoms: profile.blossoms + amount })
      .eq('id', userId);
    
    if (error) {
      console.error('Error awarding blossoms:', error);
      return false;
    }
    
    console.log(`Awarded ${amount} blossoms for: ${reason}`);
    return true;
  } catch (error) {
    console.error('Error in awardBlossoms:', error);
    return false;
  }
}

export async function checkFirstExerciseOfDay(userId: string): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('exercises_completed')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', `${today}T00:00:00`)
      .limit(1);
    
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking first exercise:', error);
    return false;
  }
}

export async function checkHubSequenceCompletion(userId: string, hubName: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('exercises_completed')
      .select('exercise_index')
      .eq('user_id', userId)
      .eq('hub_name', hubName);
    
    if (!data) return false;
    
    // Check if all 5 exercises (0-4) are completed
    const completedIndices = new Set(data.map(e => e.exercise_index));
    return completedIndices.size === 5 && 
           [0, 1, 2, 3, 4].every(i => completedIndices.has(i));
  } catch (error) {
    console.error('Error checking hub sequence:', error);
    return false;
  }
}

export async function updateStreak(userId: string): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_exercise_date, streak')
      .eq('id', userId)
      .single();
    
    if (!profile) return;
    
    const today = new Date().toISOString().split('T')[0];
    const lastDate = profile.last_exercise_date;
    
    let newStreak = profile.streak || 0;
    
    if (!lastDate) {
      // First exercise ever
      newStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastDate === yesterdayStr) {
        // Consecutive day
        newStreak += 1;
      } else if (lastDate !== today) {
        // Streak broken
        newStreak = 1;
      }
      // If lastDate === today, keep current streak
    }
    
    await supabase
      .from('profiles')
      .update({ 
        streak: newStreak,
        last_exercise_date: today
      })
      .eq('id', userId);
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}
