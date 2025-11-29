
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

// Monochrome Japanese Zen Theme
export const colors = {
  // Primary colors - Pure Monochrome
  white: '#FFFFFF',
  black: '#1A1A1A', // Deep charcoal black
  
  // Grays for depth and icons
  iconGray: '#4A4A4A', // Black/gray for icons
  textSecondary: '#6B6B6B', // Light gray for secondary text
  border: '#E5E5E5', // Subtle border
  blossomGray: 'rgba(0, 0, 0, 0.08)', // 8-12% opacity neutral gray for blossoms
  
  // Semantic colors
  background: '#FFFFFF',
  text: '#1A1A1A',
  
  // Status colors (minimal use)
  danger: '#1A1A1A',
  success: '#1A1A1A',
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.black,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '300', // Light weight for Zen design
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  secondaryButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '300', // Light weight for Zen design
    letterSpacing: 0.5,
  },
  floatingButton: {
    backgroundColor: colors.white,
    paddingVertical: 18,
    paddingHorizontal: 28,
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
  floatingButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700', // Bold for main titles
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300', // Light weight
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.3,
    lineHeight: 24,
  },
  text: {
    fontSize: 15,
    fontWeight: '300', // Light weight
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32, // Large breathing space
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 24,
    marginVertical: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
