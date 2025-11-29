
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function QuickAccessBar() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/(home)/quick-calm')}
        activeOpacity={0.7}
      >
        <IconSymbol
          ios_icon_name="wind"
          android_material_icon_name="air"
          size={20}
          color={colors.black}
        />
        <Text style={styles.buttonText}>Quick Calm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/(home)/panic')}
        activeOpacity={0.7}
      >
        <IconSymbol
          ios_icon_name="exclamationmark.triangle.fill"
          android_material_icon_name="warning"
          size={20}
          color={colors.black}
        />
        <Text style={styles.buttonText}>Panic</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(tabs)/(home)/')}
        activeOpacity={0.7}
      >
        <IconSymbol
          ios_icon_name="house.fill"
          android_material_icon_name="home"
          size={20}
          color={colors.black}
        />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    right: 24,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.black,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: colors.white,
    gap: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.black,
    letterSpacing: 0.2,
  },
});
