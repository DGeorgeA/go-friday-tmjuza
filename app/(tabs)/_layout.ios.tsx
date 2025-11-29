
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

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
  },
});

export default function TabLayout() {
  return (
    <>
      <NativeTabs>
        <NativeTabs.Trigger key="home" name="(home)">
          <Icon sf="house.fill" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger key="profile" name="profile">
          <Icon sf="person.fill" />
          <Label>Profile</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
      <QuickCalmButton />
    </>
  );
}
