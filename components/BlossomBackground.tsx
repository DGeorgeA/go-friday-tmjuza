
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BlossomBackgroundProps {
  children: React.ReactNode;
}

export default function BlossomBackground({ children }: BlossomBackgroundProps) {
  const blossomAnims = useRef([...Array(12)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    blossomAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 5000 + index * 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 5000 + index * 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Abstract grayscale blossom shapes */}
      {blossomAnims.map((anim, index) => (
        <React.Fragment key={index}>
          <Animated.View
            style={[
              styles.blossom,
              {
                left: `${(index * 13) % 95}%`,
                top: `${(index * 11) % 85}%`,
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.08, 0.12, 0.08], // 8-12% opacity
                }),
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 150],
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Abstract circular shape */}
            <View style={styles.abstractShape} />
          </Animated.View>
        </React.Fragment>
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  blossom: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  abstractShape: {
    width: 40,
    height: 40,
    backgroundColor: colors.blossomGray,
    borderRadius: 20,
  },
});
