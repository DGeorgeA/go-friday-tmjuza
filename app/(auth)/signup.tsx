
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, buttonStyles } from '@/styles/commonStyles';
import BlossomBackground from '@/components/BlossomBackground';
import { supabase } from '@/app/integrations/supabase/client';
import { syncProgressToSupabase } from '@/utils/progressTracking';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const handleContinue = useCallback(() => {
    router.replace('/(tabs)/(home)/' as any);
  }, [router]);

  React.useEffect(() => {
    if (showSuccess) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // Auto-redirect after 2 seconds
      const timer = setTimeout(() => {
        handleContinue();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, fadeAnim, handleContinue]);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
        },
      });

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
      } else if (data.user) {
        // Create profile for the user
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email: data.user.email,
            blossoms: 0,
            level: 1,
            streak: 0,
            streak_multiplier: 1.0,
          },
        ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Sync any local progress to Supabase
        await syncProgressToSupabase();

        // Show success card
        setShowSuccess(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <BlossomBackground showBlossoms={true}>
        <View style={styles.container}>
          <Animated.View style={[styles.successCard, { opacity: fadeAnim }]}>
            <Text style={styles.successTitle}>You&apos;re all signed up!</Text>
            <Text style={styles.successSubtitle}>
              World&apos;s First Impulse Manager welcomes you.
            </Text>
            <TouchableOpacity
              style={buttonStyles.primaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BlossomBackground>
    );
  }

  return (
    <BlossomBackground showBlossoms={true}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journey to calm</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <TouchableOpacity
              style={[buttonStyles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={buttonStyles.primaryButtonText}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>← Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BlossomBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
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
    fontFamily: 'NotoSerifJP_700Bold',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: 'NotoSansJP_300Light',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
    marginBottom: 8,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_400Regular',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.black,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontWeight: '300',
    color: colors.black,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_300Light',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_300Light',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.black,
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_400Regular',
  },
  backButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'NotoSansJP_300Light',
  },
  successCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
    fontFamily: 'NotoSerifJP_700Bold',
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 0.3,
    fontFamily: 'NotoSansJP_300Light',
  },
});
