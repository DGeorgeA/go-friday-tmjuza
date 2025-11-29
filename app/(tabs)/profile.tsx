
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ProfileScreen() {
  return (
    <View style={[styles.container, { backgroundColor: colors.blossomPink }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Progress</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>0 days 🔥</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Time Practiced</Text>
            <Text style={styles.statValue}>0 minutes</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingValue}>Off</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Sound Effects</Text>
            <Text style={styles.settingValue}>On</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Haptic Feedback</Text>
            <Text style={styles.settingValue}>On</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About GoFriday</Text>
          <Text style={styles.aboutText}>
            GoFriday helps you manage negative impulses through evidence-based techniques 
            including CBT, ACT, Urge Surfing, and mindfulness practices.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.charcoal,
    letterSpacing: -0.5,
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
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: 16,
    color: colors.charcoal,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.charcoal,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.charcoal,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warmPink,
  },
  aboutText: {
    fontSize: 14,
    color: colors.charcoal,
    lineHeight: 22,
    marginBottom: 12,
  },
  versionText: {
    fontSize: 12,
    color: colors.charcoal,
    opacity: 0.5,
  },
});
