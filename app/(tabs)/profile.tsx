
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';
import { getCurrentLevel, userLevels } from '@/data/impulses';
import { getUserBadges, BADGES } from '@/utils/badgeSystem';
import { loadProgressFromSupabase, getLocalProgress } from '@/utils/progressTracking';

export default function ProfileScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [blossoms, setBlossoms] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakMultiplier, setStreakMultiplier] = useState(1.0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: 'Seed', blossoms: 0, nextLevel: userLevels[1] });
  const [badges, setBadges] = useState<any[]>([]);
  const [exerciseCategories, setExerciseCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        setEmail(user.email || '');
        
        // Load progress from Supabase
        await loadProgressFromSupabase();
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setBlossoms(profile.blossoms || 0);
          setStreak(profile.streak || 0);
          setStreakMultiplier(profile.streak_multiplier || 1.0);
          setLevelInfo(getCurrentLevel(profile.blossoms || 0));
        }
        
        // Get total exercises completed
        const { data: exercises } = await supabase
          .from('exercises_completed')
          .select('*')
          .eq('user_id', user.id);
        
        setTotalExercises(exercises?.length || 0);
        
        // Calculate exercise categories
        const categories: Record<string, number> = {};
        exercises?.forEach((ex) => {
          categories[ex.hub_name] = (categories[ex.hub_name] || 0) + 1;
        });
        setExerciseCategories(categories);
        
        // Get badges
        const userBadges = await getUserBadges(user.id);
        setBadges(userBadges);
      } else {
        // Load local progress for non-authenticated users
        const localProgress = await getLocalProgress();
        setBlossoms(localProgress.totalBlossoms);
        setStreak(localProgress.streakCounter);
        setTotalExercises(localProgress.completedExercises.length);
        setLevelInfo(getCurrentLevel(localProgress.totalBlossoms));
        setExerciseCategories(localProgress.exerciseCategories);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
  };

  const renderSakuraPlant = () => {
    const level = levelInfo.level;
    const height = Math.min(level * 20, 200);
    
    return (
      <View style={styles.sakuraContainer}>
        <View style={[styles.sakuraStem, { height }]} />
        {level >= 3 && (
          <>
            <View style={[styles.sakuraLeaf, { bottom: height * 0.7, left: -8 }]} />
            <View style={[styles.sakuraLeaf, { bottom: height * 0.5, right: -8 }]} />
          </>
        )}
        {level >= 6 && (
          <>
            <View style={[styles.sakuraBlossom, { bottom: height - 10, left: -12 }]} />
            <View style={[styles.sakuraBlossom, { bottom: height - 5, right: -12 }]} />
          </>
        )}
        {level >= 9 && (
          <>
            <View style={[styles.sakuraBlossom, { bottom: height - 15, left: 0 }]} />
            <View style={[styles.sakuraBlossom, { bottom: height - 20, right: 0 }]} />
          </>
        )}
      </View>
    );
  };

  const getStreakMultiplierText = () => {
    if (streakMultiplier >= 2.0) return '2× multiplier';
    if (streakMultiplier >= 1.5) return '1.5× multiplier';
    if (streakMultiplier >= 1.2) return '1.2× multiplier';
    return '';
  };

  if (!isAuthenticated) {
    return (
      <BlossomBackground>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Profile</Text>
              <Text style={styles.subtitle}>Sign in to track your journey</Text>
            </View>

            {/* Show local progress */}
            {totalExercises > 0 && (
              <View style={styles.localProgressCard}>
                <Text style={styles.localProgressTitle}>Local Progress</Text>
                <Text style={styles.localProgressText}>
                  {totalExercises} exercises completed
                </Text>
                <Text style={styles.localProgressText}>
                  {blossoms} blossoms earned
                </Text>
                <Text style={styles.localProgressHint}>
                  Sign in to sync and unlock badges
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={() => router.push('/(auth)/login' as any)}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.primaryButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={buttonStyles.secondaryButton}
              onPress={() => router.push('/(auth)/signup' as any)}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </BlossomBackground>
    );
  }

  const progressToNextLevel = levelInfo.nextLevel 
    ? ((blossoms - levelInfo.blossoms) / (levelInfo.nextLevel.blossoms - levelInfo.blossoms)) * 100
    : 100;

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>{email}</Text>
          </View>

          {/* Level and Blossom Card */}
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <View>
                <Text style={styles.levelNumber}>Level {levelInfo.level}</Text>
                <Text style={styles.levelName}>{levelInfo.name}</Text>
              </View>
              <Text style={styles.blossomCount}>{blossoms} 🌸</Text>
            </View>
            
            {levelInfo.nextLevel && (
              <>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressToNextLevel}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {levelInfo.nextLevel.blossoms - blossoms} blossoms to {levelInfo.nextLevel.name}
                </Text>
              </>
            )}
            
            {/* Sakura Plant Visualization */}
            <View style={styles.plantSection}>
              {renderSakuraPlant()}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <IconSymbol
                android_material_icon_name="local-fire-department"
                ios_icon_name="flame.fill"
                size={28}
                color={colors.iconGray}
              />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
              {streakMultiplier > 1.0 && (
                <Text style={styles.multiplierText}>{getStreakMultiplierText()}</Text>
              )}
            </View>

            <View style={styles.statCard}>
              <IconSymbol
                android_material_icon_name="check-circle"
                ios_icon_name="checkmark.circle.fill"
                size={28}
                color={colors.iconGray}
              />
              <Text style={styles.statValue}>{totalExercises}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
          </View>

          {/* Badges Section */}
          {badges.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Badges ({badges.length})</Text>
              
              <View style={styles.badgesGrid}>
                {badges.map((badge, index) => {
                  const badgeInfo = BADGES[badge.badge_id];
                  return (
                    <View key={index} style={styles.badgeCard}>
                      <IconSymbol
                        android_material_icon_name={badgeInfo?.icon || 'star'}
                        ios_icon_name={badgeInfo?.icon || 'star'}
                        size={32}
                        color={colors.iconGray}
                      />
                      <Text style={styles.badgeName}>{badge.badge_name}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Exercise Categories */}
          {Object.keys(exerciseCategories).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Exercise Categories</Text>
              
              <View style={styles.categoriesCard}>
                {Object.entries(exerciseCategories).map(([category, count], index) => (
                  <View key={index} style={styles.categoryRow}>
                    <Text style={styles.categoryName}>
                      {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                    <Text style={styles.categoryCount}>{count}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Blossom Earning Guide */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earn Blossoms</Text>
            
            <View style={styles.guideCard}>
              <Text style={styles.guideItem}>+5 🌸 Complete any exercise</Text>
              <Text style={styles.guideItem}>+10 🌸 Complete all 5 in a hub</Text>
              <Text style={styles.guideItem}>+15 🌸 First exercise of the day</Text>
              <Text style={styles.guideItem}>+20 🌸 Unlock a badge</Text>
              <Text style={styles.guideItem}>+25 🌸 Break an urge successfully</Text>
            </View>
          </View>

          {/* Streak Multipliers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Streak Multipliers</Text>
            
            <View style={styles.guideCard}>
              <Text style={styles.guideItem}>3 days in a row → 1.2× multiplier</Text>
              <Text style={styles.guideItem}>7 days in a row → 1.5× multiplier</Text>
              <Text style={styles.guideItem}>30 days in a row → 2× multiplier + Zen Discipline badge</Text>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  android_material_icon_name="logout"
                  ios_icon_name="arrow.right.square"
                  size={24}
                  color={colors.iconGray}
                />
                <Text style={styles.menuItemText}>Log Out</Text>
              </View>
              <IconSymbol
                android_material_icon_name="chevron-right"
                ios_icon_name="chevron.right"
                size={20}
                color={colors.iconGray}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    paddingHorizontal: 32,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  localProgressCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  localProgressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  localProgressText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  localProgressHint: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    marginTop: 8,
    letterSpacing: 0.2,
  },
  levelCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  levelName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },
  blossomCount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: -0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.black,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  plantSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  sakuraContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 220,
  },
  sakuraStem: {
    width: 3,
    backgroundColor: colors.iconGray,
    borderRadius: 1.5,
  },
  sakuraLeaf: {
    position: 'absolute',
    width: 16,
    height: 24,
    backgroundColor: colors.blossomGray,
    borderRadius: 8,
  },
  sakuraBlossom: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: colors.iconGray,
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  multiplierText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.black,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  badgeName: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.black,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.2,
  },
  categoriesCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.black,
    letterSpacing: 0.2,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
    letterSpacing: 0.2,
  },
  guideCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.black,
    gap: 12,
  },
  guideItem: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.black,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.black,
    letterSpacing: 0.2,
  },
  bottomSpacer: {
    height: 40,
  },
});
