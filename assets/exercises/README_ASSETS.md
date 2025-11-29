
# GoFriday Exercise Assets

This directory contains all assets required for the ExercisePlayer component.

## Required Assets

### Background Photos (B&W, WebP optimized)
Place these files in `/assets/exercises/`:

- `photo_stop_smoking.webp` - B&W photo of zen pathway or calm outdoor scene
- `photo_move_body.webp` - B&W photo of mountain trail or active landscape
- `photo_eat_awareness.webp` - B&W photo of peaceful dining setting or nature
- `photo_return_to_calm.webp` - B&W photo of forest or tranquil water
- `photo_steady_breath.webp` - B&W photo of open sky or breathing space
- `photo_unplug_refocus.webp` - B&W photo of quiet room or minimalist space

**Photo Requirements:**
- Format: WebP (optimized for web/mobile)
- Dimensions: 800×1200px or similar portrait ratio
- Processing: Desaturated (B&W), blur 6-10px, opacity 10-12%
- Theme: "Future self if impulses are mastered" - zen, calm, aspirational

### Blossom SVG Files
Place these files in `/assets/exercises/`:

- `blossom-1.svg` - 5-petal sakura blossom variant 1
- `blossom-2.svg` - 5-petal sakura blossom variant 2
- `blossom-3.svg` - 5-petal sakura blossom variant 3
- `blossom-4.svg` - 5-petal sakura blossom variant 4

**Blossom Requirements:**
- Format: SVG (vector)
- Size: 30×30px viewBox
- Color: #FF8DAA (Soft Blossom Pink)
- Style: Simple 5-petal sakura design
- Opacity: Will be controlled by animation (12-15%)

### Icon SVG Files
Place these files in `/assets/exercises/icons/`:

- `slowdown.svg` - ⏪ icon (backward double arrow)
- `fastforward.svg` - ⏩ icon (forward double arrow)
- `close.svg` - ✕ icon (close/exit)

**Icon Requirements:**
- Format: SVG (vector)
- Size: 24×24px viewBox
- Color: #000000 (black)
- Style: Minimal, monoline, 2px stroke
- Accessibility: Must work at 44×44px touch target

## CSS Variables

The following CSS variables are used throughout the ExercisePlayer:

```css
:root {
  --step-base: 2000ms;
  --slow1-mult: 2;
  --slow2-mult: 3;
  --interval-duration: 5000ms;
  --accent-pink: #FF8DAA;
  --photo-opacity: 0.10;
}
```

## Asset Sources

### Recommended Photo Sources:
- Unsplash (https://unsplash.com) - Search: "zen pathway", "japanese garden", "minimalist room"
- Pexels (https://pexels.com) - Search: "calm nature", "meditation space"
- Process with: Photoshop, GIMP, or online tools (remove saturation, add blur)

### Blossom SVG Template:
```svg
<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  <g fill="#FF8DAA">
    <!-- 5 petals arranged in circle -->
    <ellipse cx="15" cy="8" rx="4" ry="6" />
    <ellipse cx="22" cy="14" rx="4" ry="6" transform="rotate(72 15 15)" />
    <ellipse cx="19" cy="23" rx="4" ry="6" transform="rotate(144 15 15)" />
    <ellipse cx="11" cy="23" rx="4" ry="6" transform="rotate(216 15 15)" />
    <ellipse cx="8" cy="14" rx="4" ry="6" transform="rotate(288 15 15)" />
  </g>
</svg>
```

## Implementation Notes

1. **Photo Loading**: Currently using Unsplash URLs as fallback. Replace with local WebP files for production.
2. **Blossom Animation**: Implemented in `BlossomBackground.tsx` component.
3. **Settings Integration**: All assets respect user settings toggles (Background Photos ON/OFF, Blossoms ON/OFF).
4. **Accessibility**: Respects `prefers-reduced-motion` - disables blossom animation, uses subtle fade instead.

## File Structure

```
assets/
└── exercises/
    ├── photo_stop_smoking.webp
    ├── photo_move_body.webp
    ├── photo_eat_awareness.webp
    ├── photo_return_to_calm.webp
    ├── photo_steady_breath.webp
    ├── photo_unplug_refocus.webp
    ├── blossom-1.svg
    ├── blossom-2.svg
    ├── blossom-3.svg
    ├── blossom-4.svg
    └── icons/
        ├── slowdown.svg
        ├── fastforward.svg
        └── close.svg
```

## Testing

Use the test harness at `/app/(tabs)/(home)/exercise-test.tsx` to verify:
- Photos load correctly for each hub
- Blossoms animate smoothly
- Icons are visible and tappable
- Settings toggles work as expected
