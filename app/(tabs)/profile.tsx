
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <BlossomBackground>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Your journey to calm</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.statCard}>
              <IconSymbol
                android_material_icon_name="local-fire-department"
                ios_icon_name="flame"
                size={32}
                color={colors.iconGray}
              />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statCard}>
              <IconSymbol
                android_material_icon_name="self-improvement"
                ios_icon_name="figure.mind.and.body"
                size={32}
                color={colors.iconGray}
              />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  android_material_icon_name="notifications"
                  ios_icon_name="bell"
                  size={24}
                  color={colors.iconGray}
                />
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <IconSymbol
                android_material_icon_name="chevron-right"
                ios_icon_name="chevron.right"
                size={20}
                color={colors.iconGray}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  android_material_icon_name="palette"
                  ios_icon_name="paintbrush"
                  size={24}
                  color={colors.iconGray}
                />
                <Text style={styles.menuItemText}>Theme</Text>
              </View>
              <IconSymbol
                android_material_icon_name="chevron-right"
                ios_icon_name="chevron.right"
                size={20}
                color={colors.iconGray}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  android_material_icon_name="accessibility"
                  ios_icon_name="accessibility"
                  size={24}
                  color={colors.iconGray}
                />
                <Text style={styles.menuItemText}>Accessibility</Text>
              </View>
              <IconSymbol
                android_material_icon_name="chevron-right"
                ios_icon_name="chevron.right"
                size={20}
                color={colors.iconGray}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <IconSymbol
                  android_material_icon_name="download"
                  ios_icon_name="arrow.down.doc"
                  size={24}
                  color={colors.iconGray}
                />
                <Text style={styles.menuItemText}>Export Data</Text>
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
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  statValue: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.black,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
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
