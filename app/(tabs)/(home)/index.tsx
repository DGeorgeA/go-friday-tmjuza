
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { homeButtons } from '@/components/HomeData';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blossomAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Blossom drift animations
    blossomAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      {/* Floating blossom petals */}
      {blossomAnims.map((anim, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.blossom,
            {
              left: `${(index * 20) % 100}%`,
              opacity: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.2, 0.6, 0.2],
              }),
              transform: [
                {
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 600],
                  }),
                },
                {
                  translateX: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          🌸
        </Animated.Text>
      ))}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>🌸</Text>
          <Text style={styles.title}>GoFriday</Text>
          <Text style={styles.subtitle}>Relax into a Friday-evening calm</Text>
        </Animated.View>

        <Animated.View style={[styles.streakCard, { opacity: fadeAnim }]}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>0 day streak</Text>
          <Text style={styles.streakSubtext}>Start your journey today</Text>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          {homeButtons.map((button, index) => (
            <Animated.View
              key={button.route}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  button.text === 'Panic Button' ? buttonStyles.panicButton : buttonStyles.primaryButton,
                  styles.homeButton,
                ]}
                onPress={() => router.push(button.route as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonIcon}>{button.icon}</Text>
                <Text
                  style={
                    button.text === 'Panic Button'
                      ? buttonStyles.panicButtonText
                      : buttonStyles.primaryButtonText
                  }
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            With one tap, enter a calming intervention that makes impulses easier to manage.
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
  blossom: {
    position: 'absolute',
    fontSize: 24,
    zIndex: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  streakCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(43, 43, 47, 0.08)',
    elevation: 3,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.6,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonIcon: {
    fontSize: 24,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.charcoal,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});
