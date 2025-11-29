
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
  showBackgroundPhotos: boolean;
  showBlossoms: boolean;
  fastGesturesEnabled: boolean;
  resetSlowdownEachSession: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<Settings>({
    showBackgroundPhotos: true,
    showBlossoms: true,
    fastGesturesEnabled: true,
    resetSlowdownEachSession: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@gofriday_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('@gofriday_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: keyof Settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  return (
    <BlossomBackground showBlossoms={settings.showBlossoms} showPaperTexture={true}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your experience</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visual Preferences</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <IconSymbol
                    android_material_icon_name="image"
                    ios_icon_name="photo"
                    size={24}
                    color={colors.iconGray}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Background Photos</Text>
                    <Text style={styles.settingDescription}>
                      Show B&W photos during exercises
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.showBackgroundPhotos}
                  onValueChange={() => toggleSetting('showBackgroundPhotos')}
                  trackColor={{ false: colors.border, true: colors.blossomPink }}
                  thumbColor={colors.white}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <IconSymbol
                    android_material_icon_name="local-florist"
                    ios_icon_name="leaf"
                    size={24}
                    color={colors.iconGray}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Blossoms</Text>
                    <Text style={styles.settingDescription}>
                      Show falling blossom animation
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.showBlossoms}
                  onValueChange={() => toggleSetting('showBlossoms')}
                  trackColor={{ false: colors.border, true: colors.blossomPink }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercise Controls</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <IconSymbol
                    android_material_icon_name="touch-app"
                    ios_icon_name="hand.tap"
                    size={24}
                    color={colors.iconGray}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Fast Gestures</Text>
                    <Text style={styles.settingDescription}>
                      Enable double-tap and long-press
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.fastGesturesEnabled}
                  onValueChange={() => toggleSetting('fastGesturesEnabled')}
                  trackColor={{ false: colors.border, true: colors.blossomPink }}
                  thumbColor={colors.white}
                />
              </View>
            </View>

            <View style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <IconSymbol
                    android_material_icon_name="refresh"
                    ios_icon_name="arrow.clockwise"
                    size={24}
                    color={colors.iconGray}
                  />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Reset Slowdown Each Session</Text>
                    <Text style={styles.settingDescription}>
                      Start each exercise at normal speed
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.resetSlowdownEachSession}
                  onValueChange={() => toggleSetting('resetSlowdownEachSession')}
                  trackColor={{ false: colors.border, true: colors.blossomPink }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                GoFriday helps you manage impulses with gentle, evidence-based exercises.
              </Text>
              <Text style={styles.infoText}>
                Version 1.0.0
              </Text>
            </View>
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
    fontFamily: 'NotoSerifJP_700Bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: 'NotoSansJP_300Light',
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
    fontFamily: 'NotoSerifJP_700Bold',
  },
  settingCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 4,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_400Regular',
  },
  settingDescription: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_300Light',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.black,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.black,
    letterSpacing: 0.2,
    lineHeight: 20,
    fontFamily: 'NotoSansJP_300Light',
  },
  bottomSpacer: {
    height: 40,
  },
});
