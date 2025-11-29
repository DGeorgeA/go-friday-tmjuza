
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { impulses } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';
import { getCurrentLevel } from '@/data/impulses';
import { syncProgressToSupabase, loadProgressFromSupabase, getLocalProgress } from '@/utils/progressTracking';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [streak, setStreak] = useState(0);
  const [blossoms, setBlossoms] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, name: 'Seed', blossoms: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [streakMultiplier, setStreakMultiplier] = useState(1.0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    loadUserData();
  }, [fadeAnim]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        
        // Sync local progress to Supabase
        await syncProgressToSupabase();
        
        // Load progress from Supabase
        await loadProgressFromSupabase();
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setStreak(profile.streak || 0);
          setBlossoms(profile.blossoms || 0);
          setStreakMultiplier(profile.streak_multiplier || 1.0);
          setLevelInfo(getCurrentLevel(profile.blossoms || 0));
        }
      } else {
        // Load local progress for non-authenticated users
        const localProgress = await getLocalProgress();
        setStreak(localProgress.streakCounter);
        setBlossoms(localProgress.totalBlossoms);
        setLevelInfo(getCurrentLevel(localProgress.totalBlossoms));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleImpulsePress = (impulseId: string) => {
    // Direct launch to first exercise (index 0)
    router.push({
      pathname: '/(tabs)/(home)/exercise',
      params: { hubId: impulseId, exerciseIndex: 0 }
    } as any);
  };

  const handleAuthPress = () => {
    router.push('/(auth)/login' as any);
  };

  const getStreakText = () => {
    if (streak === 0) return 'Start your journey';
    if (streakMultiplier > 1.0) {
      return `${streak}-day streak · ${streakMultiplier}× multiplier`;
    }
    return `${streak}-day streak`;
  };

  return (
    <BlossomBackground showPaperTexture={true}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.logo}>GoFriday</Text>
            <Text style={styles.subtitle}>Calm impulses gently</Text>
            
            {isAuthenticated ? (
              <View style={styles.statsRow}>
                <Text style={styles.streak}>{getStreakText()}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleAuthPress} activeOpacity={0.7}>
                <Text style={styles.authPrompt}>Sign in to track progress</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <View style={styles.section}>
            <View style={styles.hubsGrid}>
              {impulses.map((impulse, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.hubTile}
                  onPress={() => handleImpulsePress(impulse.id)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    android_material_icon_name={impulse.icon as any}
                    ios_icon_name={impulse.icon}
                    size={32}
                    color={colors.iconGray}
                  />
                  <Text style={styles.hubName}>{impulse.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Spacer to prevent content from being hidden by floating button */}
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
    marginBottom: 64,
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
    letterSpacing: -1,
    fontFamily: 'NotoSerifJP_700Bold', // Traditional Japanese font
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
    fontFamily: 'NotoSansJP_300Light',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streak: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_300Light',
  },
  authPrompt: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
    textDecorationLine: 'underline',
    fontFamily: 'NotoSansJP_300Light',
  },
  section: {
    marginBottom: 32,
  },
  hubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  hubTile: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  hubName: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_400Regular',
  },
  bottomSpacer: {
    height: 40,
  },
});
