
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import { impulses } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';

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

  const handleImpulsePress = (impulseId: string) => {
    // Direct launch to intervention (micro tier - index 0)
    router.push({
      pathname: '/(tabs)/(home)/intervention',
      params: { impulseId, tierIndex: 0 }
    } as any);
  };

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
            <Text style={styles.streak}>0-day streak · Start your journey</Text>
          </Animated.View>

          <View style={styles.section}>
            <View style={styles.hubsGrid}>
              {impulses.map((impulse, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
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
                </React.Fragment>
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
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  streak: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.2,
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
  },
  bottomSpacer: {
    height: 40,
  },
});
