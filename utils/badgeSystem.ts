
import { supabase } from '@/app/integrations/supabase/client';
import { awardBlossoms } from './blossomRewards';

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'impulse' | 'global';
  icon: string;
  requirement: string;
}

// Badge definitions
export const BADGES: Record<string, Badge> = {
  // Impulse-Specific Badges
  'smoke-breaker': {
    id: 'smoke-breaker',
    name: 'Smoke Breaker',
    description: '7 days of "Stop Smoking" exercises',
    type: 'impulse',
    icon: 'smoke-free',
    requirement: 'stop-smoking-7-days',
  },
  'mindful-eater': {
    id: 'mindful-eater',
    name: 'Mindful Eater',
    description: '10 mindful eating exercises',
    type: 'impulse',
    icon: 'restaurant-menu',
    requirement: 'eat-awareness-10-exercises',
  },
  'movement-starter': {
    id: 'movement-starter',
    name: 'Movement Starter',
    description: '5 "Move Your Body" sessions',
    type: 'impulse',
    icon: 'directions-run',
    requirement: 'move-body-5-exercises',
  },
  'anger-alchemist': {
    id: 'anger-alchemist',
    name: 'Anger Alchemist',
    description: '8 calming sessions',
    type: 'impulse',
    icon: 'self-improvement',
    requirement: 'return-calm-8-exercises',
  },
  'still-waters': {
    id: 'still-waters',
    name: 'Still Waters',
    description: '5 panic recoveries',
    type: 'impulse',
    icon: 'air',
    requirement: 'steady-breath-5-exercises',
  },
  'digital-monk': {
    id: 'digital-monk',
    name: 'Digital Monk',
    description: '3 days under 1 hour of scrolling',
    type: 'impulse',
    icon: 'phone-disabled',
    requirement: 'unplug-refocus-3-days',
  },
  
  // Global Badges
  'first-blossom': {
    id: 'first-blossom',
    name: 'First Blossom',
    description: 'First completed exercise',
    type: 'global',
    icon: 'local-florist',
    requirement: 'first-exercise',
  },
  'morning-calm': {
    id: 'morning-calm',
    name: 'Morning Calm',
    description: 'Complete 3 mornings in a row',
    type: 'global',
    icon: 'wb-sunny',
    requirement: '3-morning-streak',
  },
  'night-restore': {
    id: 'night-restore',
    name: 'Night Restore',
    description: 'Complete 3 nights in a row',
    type: 'global',
    icon: 'nightlight',
    requirement: '3-night-streak',
  },
  'weekly-bloom': {
    id: 'weekly-bloom',
    name: 'Weekly Bloom',
    description: '7-day streak',
    type: 'global',
    icon: 'calendar-today',
    requirement: '7-day-streak',
  },
  'friday-mode': {
    id: 'friday-mode',
    name: 'Friday Mode',
    description: 'Complete 5 exercises within 24 hours',
    type: 'global',
    icon: 'flash-on',
    requirement: '5-exercises-24h',
  },
  'zen-discipline': {
    id: 'zen-discipline',
    name: 'Zen Discipline',
    description: '30-day streak',
    type: 'global',
    icon: 'emoji-events',
    requirement: '30-day-streak',
  },
};

// Check if user has a badge
export async function hasBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .limit(1);
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking badge:', error);
    return false;
  }
}

// Award a badge to user
export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const badge = BADGES[badgeId];
    if (!badge) {
      console.error('Badge not found:', badgeId);
      return false;
    }
    
    // Check if user already has this badge
    const alreadyHas = await hasBadge(userId, badgeId);
    if (alreadyHas) {
      console.log('User already has badge:', badgeId);
      return false;
    }
    
    // Award the badge
    const { error } = await supabase.from('badges').insert([
      {
        user_id: userId,
        badge_id: badgeId,
        badge_name: badge.name,
        badge_type: badge.type,
        blossoms_earned: 20,
      },
    ]);
    
    if (error) {
      console.error('Error awarding badge:', error);
      return false;
    }
    
    // Award blossoms for unlocking badge
    await awardBlossoms(userId, 20, `Unlocked badge: ${badge.name}`);
    
    console.log(`Badge awarded: ${badge.name}`);
    return true;
  } catch (error) {
    console.error('Error in awardBadge:', error);
    return false;
  }
}

// Get all badges for a user
export async function getUserBadges(userId: string): Promise<any[]> {
  try {
    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    
    return data || [];
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
}

// Check and award badges based on user activity
export async function checkAndAwardBadges(userId: string): Promise<void> {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!profile) return;
    
    // Get all exercises completed
    const { data: exercises } = await supabase
      .from('exercises_completed')
      .select('*')
      .eq('user_id', userId);
    
    if (!exercises) return;
    
    // Check First Blossom
    if (exercises.length === 1) {
      await awardBadge(userId, 'first-blossom');
    }
    
    // Check Weekly Bloom (7-day streak)
    if (profile.streak >= 7) {
      await awardBadge(userId, 'weekly-bloom');
    }
    
    // Check Zen Discipline (30-day streak)
    if (profile.streak >= 30) {
      await awardBadge(userId, 'zen-discipline');
    }
    
    // Check impulse-specific badges
    const hubCounts: Record<string, number> = {};
    exercises.forEach((ex) => {
      hubCounts[ex.hub_name] = (hubCounts[ex.hub_name] || 0) + 1;
    });
    
    // Smoke Breaker - 7 days of stop-smoking exercises
    const stopSmokingDays = await getUniqueDaysForHub(userId, 'stop-smoking');
    if (stopSmokingDays >= 7) {
      await awardBadge(userId, 'smoke-breaker');
    }
    
    // Mindful Eater - 10 eating exercises
    if (hubCounts['eat-awareness'] >= 10) {
      await awardBadge(userId, 'mindful-eater');
    }
    
    // Movement Starter - 5 move body exercises
    if (hubCounts['move-body'] >= 5) {
      await awardBadge(userId, 'movement-starter');
    }
    
    // Anger Alchemist - 8 calming exercises
    if (hubCounts['return-calm'] >= 8) {
      await awardBadge(userId, 'anger-alchemist');
    }
    
    // Still Waters - 5 panic recoveries
    if (hubCounts['steady-breath'] >= 5) {
      await awardBadge(userId, 'still-waters');
    }
    
    // Digital Monk - 3 days of unplugging
    const unplugDays = await getUniqueDaysForHub(userId, 'unplug-refocus');
    if (unplugDays >= 3) {
      await awardBadge(userId, 'digital-monk');
    }
    
    // Check Friday Mode - 5 exercises in 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const recentExercises = exercises.filter(
      (ex) => new Date(ex.completed_at) >= last24Hours
    );
    if (recentExercises.length >= 5) {
      await awardBadge(userId, 'friday-mode');
    }
    
    // Check Morning Calm - 3 mornings in a row
    const morningStreak = await checkMorningStreak(userId);
    if (morningStreak >= 3) {
      await awardBadge(userId, 'morning-calm');
    }
    
    // Check Night Restore - 3 nights in a row
    const nightStreak = await checkNightStreak(userId);
    if (nightStreak >= 3) {
      await awardBadge(userId, 'night-restore');
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

// Helper: Get unique days for a specific hub
async function getUniqueDaysForHub(userId: string, hubName: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('exercises_completed')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('hub_name', hubName);
    
    if (!data) return 0;
    
    const uniqueDays = new Set(
      data.map((ex) => new Date(ex.completed_at).toISOString().split('T')[0])
    );
    
    return uniqueDays.size;
  } catch (error) {
    console.error('Error getting unique days:', error);
    return 0;
  }
}

// Helper: Check morning streak (exercises completed between 5 AM - 12 PM)
async function checkMorningStreak(userId: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('exercises_completed')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);
    
    if (!data || data.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 3; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const morningExercise = data.find((ex) => {
        const exDate = new Date(ex.completed_at);
        const exDateStr = exDate.toISOString().split('T')[0];
        const hour = exDate.getHours();
        return exDateStr === dateStr && hour >= 5 && hour < 12;
      });
      
      if (morningExercise) {
        streak++;
      } else {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  } catch (error) {
    console.error('Error checking morning streak:', error);
    return 0;
  }
}

// Helper: Check night streak (exercises completed between 8 PM - 11:59 PM)
async function checkNightStreak(userId: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('exercises_completed')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(30);
    
    if (!data || data.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    
    for (let i = 0; i < 3; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const nightExercise = data.find((ex) => {
        const exDate = new Date(ex.completed_at);
        const exDateStr = exDate.toISOString().split('T')[0];
        const hour = exDate.getHours();
        return exDateStr === dateStr && hour >= 20;
      });
      
      if (nightExercise) {
        streak++;
      } else {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  } catch (error) {
    console.error('Error checking night streak:', error);
    return 0;
  }
}
