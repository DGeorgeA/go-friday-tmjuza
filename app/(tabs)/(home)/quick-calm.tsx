
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { impulses } from '@/data/impulses';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';

export default function QuickCalmScreen() {
  const router = useRouter();

  const handleHubPress = (hubId: string) => {
    // Launch first exercise of the hub
    router.push({
      pathname: '/(tabs)/(home)/exercise',
      params: { hubId, exerciseIndex: 0 }
    } as any);
  };

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Quick Calm</Text>
            <Text style={styles.subtitle}>Instant relief in 2 minutes</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Focus</Text>
            {impulses.map((impulse, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hubCard}
                onPress={() => handleHubPress(impulse.id)}
                activeOpacity={0.8}
              >
                <View style={styles.hubCardLeft}>
                  <IconSymbol
                    android_material_icon_name={impulse.icon as any}
                    ios_icon_name={impulse.icon}
                    size={28}
                    color={colors.iconGray}
                  />
                  <View style={styles.hubCardText}>
                    <Text style={styles.hubCardName}>{impulse.name}</Text>
                    <Text style={styles.hubCardDescription}>{impulse.description}</Text>
                  </View>
                </View>
                <IconSymbol
                  android_material_icon_name="chevron-right"
                  ios_icon_name="chevron.right"
                  size={20}
                  color={colors.iconGray}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Spacer */}
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
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  hubCard: {
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
  hubCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  hubCardText: {
    flex: 1,
  },
  hubCardName: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  hubCardDescription: {
    fontSize: 13,
    fontWeight: '300',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});
