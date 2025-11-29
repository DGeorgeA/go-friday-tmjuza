
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import QuickAccessBar from '@/components/QuickAccessBar';

export default function RelaxIntoFridayScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
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
            <Text style={styles.title}>Relax Into Friday</Text>
            <Text style={styles.subtitle}>
              Let go of the week&apos;s tension.{'\n'}
              Embrace the calm of a Friday evening.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.cardTitle}>What is Friday Mode?</Text>
            <Text style={styles.cardText}>
              Friday evening represents the perfect state of calm—the week is done, 
              responsibilities fade, and you can finally breathe. This mode helps you 
              access that feeling anytime, anywhere.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <Text style={styles.cardTitle}>How it works:</Text>
            <Text style={styles.cardText}>
              - Choose a 60-90 second intervention{'\n'}
              - Follow the gentle guidance{'\n'}
              - Feel impulses soften and fade{'\n'}
              - Return to your day with clarity
            </Text>
          </Animated.View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={() => router.push('/(tabs)/(home)/quick-calm')}
            >
              <Text style={buttonStyles.primaryButtonText}>
                Start Quick Calm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={buttonStyles.secondaryButton}
              onPress={() => router.push('/(tabs)/(home)/')}
            >
              <Text style={buttonStyles.secondaryButtonText}>
                Browse Impulse Hubs
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.philosophyCard}>
            <Text style={styles.philosophyTitle}>The Friday Philosophy</Text>
            <Text style={styles.philosophyText}>
              You don&apos;t need to fight your impulses. You don&apos;t need to be perfect. 
              You just need to pause, breathe, and remember: this moment will pass. 
              Like Friday evening, calm is always available to you.
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 22,
  },
  quickActions: {
    marginVertical: 24,
  },
  philosophyCard: {
    backgroundColor: colors.black,
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
  },
  philosophyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  philosophyText: {
    fontSize: 14,
    color: colors.white,
    lineHeight: 22,
    textAlign: 'center',
  },
});
