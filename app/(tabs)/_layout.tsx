
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

function QuickCalmButton() {
  const router = useRouter();

  const handleQuickCalm = () => {
    router.push('/(tabs)/(home)/quick-calm' as any);
  };

  return (
    <SafeAreaView style={quickCalmStyles.safeArea} edges={['bottom']}>
      <View style={quickCalmStyles.container}>
        <TouchableOpacity
          style={quickCalmStyles.button}
          onPress={handleQuickCalm}
          activeOpacity={0.8}
        >
          <Text style={quickCalmStyles.buttonText}>Quick Calm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const quickCalmStyles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    marginBottom: 90,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    fontFamily: 'NotoSansJP_400Regular',
  },
});

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
    {
      name: 'settings',
      route: '/(tabs)/settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="profile" name="profile" />
        <Stack.Screen key="settings" name="settings" />
      </Stack>
      <QuickCalmButton />
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
