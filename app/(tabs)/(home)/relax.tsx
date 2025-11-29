
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';

export default function RelaxIntoFridayScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Animated.Text style={[styles.icon, { transform: [{ translateY }] }]}>
            🌸
          </Animated.Text>
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
            • Choose a 60-90 second intervention{'\n'}
            • Follow the gentle guidance{'\n'}
            • Feel impulses soften and fade{'\n'}
            • Return to your day with clarity
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
            onPress={() => router.push('/(tabs)/(home)/hubs')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 12,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(43, 43, 47, 0.08)',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 24,
    opacity: 0.8,
  },
  quickActions: {
    marginVertical: 24,
  },
  philosophyCard: {
    backgroundColor: colors.warmPink,
    borderRadius: 20,
    padding: 24,
    marginTop: 16,
  },
  philosophyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  philosophyText: {
    fontSize: 16,
    color: colors.white,
    lineHeight: 24,
    textAlign: 'center',
  },
});
