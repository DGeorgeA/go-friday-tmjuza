
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulses } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
            <Text style={styles.logo}>GoFriday</Text>
            <Text style={styles.subtitle}>Calm impulses gently</Text>
          </Animated.View>

          <Animated.View style={[styles.streakCard, { opacity: fadeAnim }]}>
            <Text style={styles.streakText}>0 day streak</Text>
            <Text style={styles.streakSubtext}>Start your journey today</Text>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impulse Hubs</Text>
            <View style={styles.hubsGrid}>
              {impulses.map((impulse, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.hubWidget}
                    onPress={() => router.push({
                      pathname: '/(tabs)/(home)/intervention',
                      params: { impulseId: impulse.id, tierIndex: 0 }
                    } as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.hubIconContainer}>
                      <Text style={styles.hubIcon}>{impulse.icon}</Text>
                    </View>
                    <Text style={styles.hubName}>{impulse.name}</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tap any impulse hub to start a calming intervention
            </Text>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  streakCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 16,
  },
  hubsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  hubWidget: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hubIconContainer: {
    marginBottom: 8,
  },
  hubIcon: {
    fontSize: 32,
  },
  hubName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
