
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, AccessibilityInfo } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BlossomBackgroundProps {
  children: React.ReactNode;
  showPaperTexture?: boolean;
  showBlossoms?: boolean;
}

export default function BlossomBackground({ 
  children, 
  showPaperTexture = true,
  showBlossoms = true 
}: BlossomBackgroundProps) {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const blossomAnims = useRef([...Array(8)].map(() => ({
    translateY: new Animated.Value(0),
    rotate: new Animated.Value(0),
    scale: new Animated.Value(1),
    opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    // Check for reduced motion preference
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReducedMotion(enabled || false);
    });
  }, []);

  useEffect(() => {
    if (!showBlossoms || reducedMotion) return;

    blossomAnims.forEach((anim, index) => {
      // Stagger the start times
      setTimeout(() => {
        Animated.loop(
          Animated.parallel([
            // Falling animation
            Animated.timing(anim.translateY, {
              toValue: 800,
              duration: 8000 + index * 1000,
              useNativeDriver: true,
            }),
            // Rotation animation
            Animated.timing(anim.rotate, {
              toValue: 360,
              duration: 8000 + index * 1000,
              useNativeDriver: true,
            }),
            // Scale animation (subtle depth)
            Animated.sequence([
              Animated.timing(anim.scale, {
                toValue: 1.05,
                duration: 4000 + index * 500,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.9,
                duration: 4000 + index * 500,
                useNativeDriver: true,
              }),
            ]),
            // Opacity animation
            Animated.sequence([
              Animated.timing(anim.opacity, {
                toValue: 0.12 + (index % 2) * 0.03, // 12-15% opacity
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0.1,
                duration: 6000 + index * 1000,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      }, index * 1500);
    });
  }, [blossomAnims, showBlossoms, reducedMotion]);

  return (
    <View style={styles.container}>
      {/* Paper texture overlay (very subtle) */}
      {showPaperTexture && (
        <View style={styles.paperTexture} />
      )}
      
      {/* Pink blossom leaves */}
      {showBlossoms && !reducedMotion && blossomAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.blossomLeaf,
            {
              left: `${10 + (index * 12) % 80}%`,
              top: -50,
              opacity: anim.opacity,
              transform: [
                { translateY: anim.translateY },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                { scale: anim.scale },
              ],
            },
          ]}
        >
          {/* Sakura petal shape */}
          <View style={styles.petalContainer}>
            <View style={[styles.petal, styles.petal1]} />
            <View style={[styles.petal, styles.petal2]} />
            <View style={[styles.petal, styles.petal3]} />
            <View style={[styles.petal, styles.petal4]} />
            <View style={[styles.petal, styles.petal5]} />
          </View>
        </Animated.View>
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
  paperTexture: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)', // Very subtle paper grain effect
    opacity: 0.4,
  },
  blossomLeaf: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  petalContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 12,
    height: 18,
    backgroundColor: colors.blossomPink,
    borderRadius: 12,
  },
  petal1: {
    top: 0,
    left: 9,
  },
  petal2: {
    top: 6,
    left: 18,
    transform: [{ rotate: '72deg' }],
  },
  petal3: {
    top: 18,
    left: 15,
    transform: [{ rotate: '144deg' }],
  },
  petal4: {
    top: 18,
    left: 3,
    transform: [{ rotate: '216deg' }],
  },
  petal5: {
    top: 6,
    left: 0,
    transform: [{ rotate: '288deg' }],
  },
});
