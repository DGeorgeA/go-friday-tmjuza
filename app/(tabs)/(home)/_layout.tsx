
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="hubs" />
      <Stack.Screen name="hub/[id]" />
      <Stack.Screen name="intervention" />
      <Stack.Screen name="quick-calm" />
      <Stack.Screen name="breathing" />
      <Stack.Screen name="panic" />
      <Stack.Screen name="relax" />
    </Stack>
  );
}
