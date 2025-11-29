
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BlossomBackgroundProps {
  children: React.ReactNode;
}

export default function BlossomBackground({ children }: BlossomBackgroundProps) {
  const blossomAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    blossomAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 4000 + index * 600,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 4000 + index * 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Pink blossoms with black leaves */}
      {blossomAnims.map((anim, index) => (
        <React.Fragment key={index}>
          <Animated.View
            style={[
              styles.blossom,
              {
                left: `${(index * 15) % 90}%`,
                top: `${(index * 12) % 80}%`,
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.1, 0.3, 0.1],
                }),
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.blossomContainer}>
              {/* Pink petals */}
              <View style={[styles.petal, { backgroundColor: colors.blossomPink }]} />
              <View style={[styles.petal, { backgroundColor: colors.blossomPink, transform: [{ rotate: '72deg' }] }]} />
              <View style={[styles.petal, { backgroundColor: colors.blossomPink, transform: [{ rotate: '144deg' }] }]} />
              <View style={[styles.petal, { backgroundColor: colors.blossomPink, transform: [{ rotate: '216deg' }] }]} />
              <View style={[styles.petal, { backgroundColor: colors.blossomPink, transform: [{ rotate: '288deg' }] }]} />
              {/* Black center */}
              <View style={styles.center} />
            </View>
          </Animated.View>
          {/* Black leaves */}
          <Animated.View
            style={[
              styles.leaf,
              {
                left: `${((index * 15) + 5) % 90}%`,
                top: `${((index * 12) + 10) % 80}%`,
                opacity: anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.05, 0.15, 0.05],
                }),
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 120],
                    }),
                  },
                  {
                    rotate: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-180deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.leafShape} />
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
    width: 30,
    height: 30,
  },
  blossomContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 18,
    borderRadius: 6,
    top: 0,
  },
  center: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.black,
  },
  leaf: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  leafShape: {
    width: 20,
    height: 20,
    backgroundColor: colors.black,
    borderRadius: 10,
    transform: [{ scaleX: 0.5 }],
  },
});
