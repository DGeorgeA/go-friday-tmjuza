
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

export const colors = {
  blossomPink: '#F7D7E3',
  warmPink: '#FF8DAA',
  serenityGray: '#F5F7FA',
  charcoal: '#2B2B2F',
  white: '#FFFFFF',
  border: '#FF8DAA40',
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.warmPink,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(255, 141, 170, 0.25)',
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.warmPink,
    boxShadow: '0px 2px 8px rgba(255, 141, 170, 0.15)',
    elevation: 2,
  },
  secondaryButtonText: {
    color: colors.warmPink,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  panicButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 6px 16px rgba(255, 59, 48, 0.3)',
    elevation: 6,
  },
  panicButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.blossomPink,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.blossomPink,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.charcoal,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.charcoal,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.charcoal,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(43, 43, 47, 0.08)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
