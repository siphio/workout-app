# Clean Gains — Assets Reference

Documentation for all graphic assets used in the app.

---

## Comparison Graphics

Low-poly geometric illustrations for post-workout celebrations.

### Style Guide

- **Style:** Low-poly geometric / faceted
- **Primary Color:** Emerald `#10b981`
- **Secondary Shades:** `#059669`, `#34d399`
- **Accents:** White `#fafafa`
- **Background:** Transparent (PNG)
- **Dimensions:** 400×400px minimum

### Generation Prompt Template

Use this prompt for generating consistent comparison graphics:

```
Low-poly geometric illustration of a [SUBJECT] for a fitness app achievement screen.

STYLE REQUIREMENTS:
- Low-poly faceted geometric style
- Built from angular polygon shapes
- No outlines or strokes
- Clean, sharp edges

COLOR PALETTE:
- Primary: Emerald green #10b981
- Secondary: Darker green #059669
- Highlights: Lighter green #34d399
- Accents: White #fafafa for small details

COMPOSITION:
- Side profile or 3/4 view
- Centered in frame with padding
- Friendly, non-threatening appearance

BACKGROUND:
- Pure white (#FFFFFF) or transparent

MOOD:
- Celebratory, achievement-oriented
- Sophisticated but playful
- Premium app aesthetic
```

### Assets List

| Asset | Weight Range | File | Status |
|-------|--------------|------|--------|
| T-Rex | 8,000 - 12,000 kg | `comparisons/trex.png` | ✅ Complete |
| Baby Elephant | 500 - 1,500 kg | `comparisons/baby-elephant.png` | ⏳ Pending |
| Grand Piano | 1,500 - 3,000 kg | `comparisons/grand-piano.png` | ⏳ Pending |
| Small Car | 3,000 - 5,000 kg | `comparisons/small-car.png` | ⏳ Pending |
| Helicopter | 5,000 - 8,000 kg | `comparisons/helicopter.png` | ⏳ Pending |
| African Elephant | 12,000 - 18,000 kg | `comparisons/african-elephant.png` | ⏳ Pending |
| School Bus | 18,000 - 30,000 kg | `comparisons/school-bus.png` | ⏳ Pending |
| Blue Whale | 30,000+ kg | `comparisons/blue-whale.png` | ⏳ Pending |

---

## Hero Backgrounds

Abstract geometric backgrounds for the home screen.

### Style Guide

- **Style:** Abstract geometric shapes
- **Color:** Dark with emerald accent glow
- **Background:** Rich black `#09090b`
- **Dimensions:** 1290×800px (iPhone 16 Pro Max upper section)

### Variants

| Workout Type | Accent Style | File | Status |
|--------------|--------------|------|--------|
| Push Day | Angular shapes, emerald glow | `heroes/hero-push.png` | ⏳ Pending |
| Pull Day | Curved shapes, teal variation | `heroes/hero-pull.png` | ⏳ Pending |
| Legs Day | Grounded shapes, amber glow | `heroes/hero-legs.png` | ⏳ Pending |
| Rest Day | Soft shapes, muted gray | `heroes/hero-rest.png` | ⏳ Pending |

---

## App Icons

### Specifications

| Size | Usage | File |
|------|-------|------|
| 192×192px | PWA manifest | `icons/icon-192.png` |
| 512×512px | PWA manifest | `icons/icon-512.png` |
| 180×180px | Apple touch icon | `icons/apple-touch-icon.png` |
| 32×32px | Favicon | `icons/favicon-32.png` |
| 16×16px | Favicon | `icons/favicon-16.png` |

### Design

- **Background:** Rich black `#09090b`
- **Icon:** Emerald checkmark or upward arrow
- **Style:** Minimal, matches app aesthetic

---

## Usage in Code

### Comparison Selection Logic

```typescript
const comparisons = [
  { min: 500, max: 1500, name: 'Baby Elephant', image: '/images/comparisons/baby-elephant.png' },
  { min: 1500, max: 3000, name: 'Grand Piano', image: '/images/comparisons/grand-piano.png' },
  { min: 3000, max: 5000, name: 'Small Car', image: '/images/comparisons/small-car.png' },
  { min: 5000, max: 8000, name: 'Helicopter', image: '/images/comparisons/helicopter.png' },
  { min: 8000, max: 12000, name: 'T-Rex', image: '/images/comparisons/trex.png' },
  { min: 12000, max: 18000, name: 'African Elephant', image: '/images/comparisons/african-elephant.png' },
  { min: 18000, max: 30000, name: 'School Bus', image: '/images/comparisons/school-bus.png' },
  { min: 30000, max: Infinity, name: 'Blue Whale', image: '/images/comparisons/blue-whale.png' },
];

function getComparison(weightKg: number) {
  return comparisons.find(c => weightKg >= c.min && weightKg < c.max);
}
```

### Hero Background Selection

```typescript
const heroBackgrounds = {
  push: '/images/heroes/hero-push.png',
  pull: '/images/heroes/hero-pull.png',
  legs: '/images/heroes/hero-legs.png',
  rest: '/images/heroes/hero-rest.png',
};
```

---

*Assets Reference v1.0*
