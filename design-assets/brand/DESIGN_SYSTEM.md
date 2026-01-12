# Clean Gains Design System

A comprehensive design system for the Clean Gains workout tracking PWA.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Border Radius](#border-radius)
5. [Component Styles](#component-styles)
6. [Illustration Style](#illustration-style)
7. [Tailwind Configuration](#tailwind-configuration)
8. [CSS Variables](#css-variables)

---

## Color Palette

### Core Colors

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| Background | Rich Black | `#09090b` | 9, 9, 11 | Main app background |
| Surface | Zinc 900 | `#18181b` | 24, 24, 27 | Cards, modals, elevated surfaces |
| Surface Elevated | Zinc 800 | `#27272a` | 39, 39, 42 | Hover states, input fields |
| Border | Zinc 700 | `#3f3f46` | 63, 63, 70 | Dividers, outlines, separators |

### Text Colors

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| Text Primary | Zinc 50 | `#fafafa` | 250, 250, 250 | Headings, important text |
| Text Secondary | Zinc 400 | `#a1a1aa` | 161, 161, 170 | Subtitles, labels, section headers |
| Text Muted | Zinc 500 | `#71717a` | 113, 113, 122 | Placeholders, hints, disabled text |

### Semantic Colors

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| Success | Emerald 500 | `#10b981` | 16, 185, 129 | Checkmarks, PRs, completed states |
| Success Light | Emerald 400 | `#34d399` | 52, 211, 153 | Success hover states |
| Success Dark | Emerald 600 | `#059669` | 5, 150, 105 | Illustration accents |
| Error | Red 500 | `#ef4444` | 239, 68, 68 | Failed, skipped, destructive actions |
| Error Light | Red 400 | `#f87171` | 248, 113, 113 | Error hover states |
| Warning | Amber 500 | `#f59e0b` | 245, 158, 11 | Caution, rest timer warnings |

### Accent Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary Accent | White | `#ffffff` | Primary buttons, focus states |
| Secondary Accent | Emerald 500 | `#10b981` | Active states, highlights, progress |

---

## Typography

### Font Family

**Primary Font:** Inter

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale

| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---------|------|--------|------|-------------|----------------|
| H1 (Hero) | Inter | Bold (700) | 32px | 40px | -0.02em |
| H2 (Section Title) | Inter | Semibold (600) | 24px | 32px | -0.01em |
| H3 (Card Title) | Inter | Semibold (600) | 18px | 28px | 0 |
| Body | Inter | Regular (400) | 16px | 24px | 0 |
| Body Small | Inter | Regular (400) | 14px | 20px | 0 |
| Caption | Inter | Medium (500) | 12px | 16px | 0.02em |
| Button | Inter | Semibold (600) | 16px | 24px | 0.01em |
| Button Small | Inter | Semibold (600) | 14px | 20px | 0.01em |
| Stats (Large Numbers) | Inter | Bold (700) | 48px | 56px | -0.02em |
| Stats Medium | Inter | Bold (700) | 24px | 32px | -0.01em |
| Label (Uppercase) | Inter | Medium (500) | 12px | 16px | 0.08em |

### Usage Examples

```css
/* H1 - Hero headings */
.h1 {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -0.02em;
  color: #fafafa;
}

/* H2 - Section titles */
.h2 {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  letter-spacing: -0.01em;
  color: #fafafa;
}

/* Body text */
.body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #fafafa;
}

/* Section label (uppercase) */
.label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a1a1aa;
}

/* Large stat numbers */
.stat-large {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 56px;
  letter-spacing: -0.02em;
  color: #fafafa;
}
```

---

## Spacing

### Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `space-0` | 0 | 0px | No spacing |
| `space-1` | 0.25rem | 4px | Tight gaps, icon padding |
| `space-2` | 0.5rem | 8px | Between related elements, small gaps |
| `space-3` | 0.75rem | 12px | Compact component padding |
| `space-4` | 1rem | 16px | Standard component padding |
| `space-5` | 1.25rem | 20px | Card internal padding |
| `space-6` | 1.5rem | 24px | Section margins, card padding |
| `space-8` | 2rem | 32px | Between major sections |
| `space-10` | 2.5rem | 40px | Large separations |
| `space-12` | 3rem | 48px | Page-level spacing |
| `space-16` | 4rem | 64px | Hero sections |

### Common Spacing Patterns

| Pattern | Value | Usage |
|---------|-------|-------|
| Page horizontal padding | 24px | Left/right margins on all screens |
| Card padding | 20px | Internal padding for cards |
| Card gap | 12px | Space between stacked cards |
| Section gap | 24px | Space between major sections |
| Button padding (vertical) | 16px | Top/bottom padding |
| Button padding (horizontal) | 24px | Left/right padding |
| Input padding | 12px 16px | Internal input field padding |
| List item gap | 8px | Space between list items |
| Icon-to-text gap | 8px | Space between icon and label |

### Layout Spacing

```css
/* Page container */
.page {
  padding: 0 24px;
}

/* Section spacing */
.section {
  margin-bottom: 24px;
}

/* Card spacing */
.card {
  padding: 20px;
  margin-bottom: 12px;
}

/* Header spacing */
.header {
  padding: 16px 24px;
}
```

---

## Border Radius

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | No rounding |
| `radius-sm` | 4px | Small elements, progress bars |
| `radius-md` | 6px | Checkboxes, small badges |
| `radius-lg` | 8px | Input fields, small buttons |
| `radius-xl` | 12px | Buttons, medium components |
| `radius-2xl` | 16px | Cards, modals |
| `radius-3xl` | 24px | Large cards, hero overlays |
| `radius-full` | 9999px | Pills, circular elements, avatars |

### Component Radius Reference

| Component | Radius |
|-----------|--------|
| Primary Button | 12px |
| Secondary Button | 12px |
| Input Field | 8px |
| Card | 16px |
| Modal | 16px |
| Checkbox | 6px |
| Toggle Switch | 9999px (full) |
| Avatar | 9999px (full) |
| Progress Bar | 4px |
| Badge/Pill | 9999px (full) |
| Bottom Sheet | 24px (top corners only) |

---

## Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
  background: #ffffff;
  color: #09090b;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #e4e4e7;
}

.btn-primary:active {
  background: #d4d4d8;
}
```

#### Secondary Button (Outline)
```css
.btn-secondary {
  background: transparent;
  color: #fafafa;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #3f3f46;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-secondary:hover {
  background: #27272a;
}

.btn-secondary:active {
  background: #3f3f46;
}
```

#### Text Button
```css
.btn-text {
  background: transparent;
  color: #a1a1aa;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.btn-text:hover {
  color: #fafafa;
}
```

### Cards

#### Standard Card
```css
.card {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 16px;
  padding: 20px;
}
```

#### Elevated Card (for modals, dropdowns)
```css
.card-elevated {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 16px;
  padding: 20px;
}
```

### Input Fields

```css
.input {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #fafafa;
  width: 100%;
  transition: border-color 0.2s ease;
}

.input::placeholder {
  color: #71717a;
}

.input:focus {
  outline: none;
  border-color: #ffffff;
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Toggle Switch

```css
.toggle {
  width: 48px;
  height: 28px;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
}

.toggle-off {
  background: #3f3f46;
}

.toggle-on {
  background: #10b981;
}

.toggle-knob {
  width: 24px;
  height: 24px;
  background: #ffffff;
  border-radius: 9999px;
  position: absolute;
  top: 2px;
  transition: left 0.2s ease;
}

.toggle-off .toggle-knob {
  left: 2px;
}

.toggle-on .toggle-knob {
  left: 22px;
}
```

### Checkmark (Completed State)

```css
.checkmark {
  width: 24px;
  height: 24px;
  background: #10b981;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark-icon {
  color: #ffffff;
  width: 14px;
  height: 14px;
}

.checkmark-empty {
  width: 24px;
  height: 24px;
  background: transparent;
  border: 2px solid #3f3f46;
  border-radius: 6px;
}
```

### Progress Bar

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: #27272a;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #10b981;
  border-radius: 4px;
  transition: width 0.3s ease;
}
```

### Bottom Navigation

```css
.bottom-nav {
  background: #18181b;
  border-top: 1px solid #27272a;
  padding: 8px 0 24px 0; /* Extra bottom padding for safe area */
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
}

.nav-item-inactive {
  color: #71717a;
}

.nav-item-active {
  color: #10b981;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}
```

---

## Illustration Style

### Overview

All illustrations use a **low-poly geometric style** with the brand color palette.

### Color Usage in Illustrations

| Element | Color | Hex |
|---------|-------|-----|
| Primary fill | Emerald 500 | `#10b981` |
| Secondary fill (shadows/depth) | Emerald 600 | `#059669` |
| Tertiary fill (darker areas) | Emerald 700 | `#047857` |
| Highlights | White | `#fafafa` |
| Accents (eyes, details) | White | `#ffffff` |

### Style Guidelines

- **Flat polygons** — No gradients within shapes, solid fills only
- **Geometric construction** — Built from triangles and simple polygons
- **Faceted look** — Visible edges between color sections
- **Minimal detail** — Reduce subjects to essential recognizable forms
- **Consistent lighting** — Light source from top-left
- **Brand colors only** — Use only emerald palette for main subjects

### Asset Specifications

| Asset Type | Dimensions | Format | Background |
|------------|------------|--------|------------|
| Comparison graphics | 400×400px | PNG | Transparent |
| Hero backgrounds | 1290×1400px | PNG/WebP | Include in image |
| Icons | 24×24px | SVG | Transparent |
| App icon | 512×512px | PNG | Solid #09090b |

---

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Background
        background: '#09090b',
        
        // Surfaces
        surface: {
          DEFAULT: '#18181b',
          elevated: '#27272a',
        },
        
        // Borders
        border: '#3f3f46',
        
        // Text
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        
        // Semantic
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
        },
        warning: '#f59e0b',
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      
      fontSize: {
        'stat': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        'h1': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        'h3': ['18px', { lineHeight: '28px' }],
        'body': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.08em' }],
      },
      
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
}
```

---

## CSS Variables

```css
:root {
  /* Colors - Background */
  --color-background: #09090b;
  --color-surface: #18181b;
  --color-surface-elevated: #27272a;
  --color-border: #3f3f46;
  
  /* Colors - Text */
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  
  /* Colors - Semantic */
  --color-success: #10b981;
  --color-success-light: #34d399;
  --color-success-dark: #059669;
  --color-error: #ef4444;
  --color-error-light: #f87171;
  --color-warning: #f59e0b;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  --font-size-stat: 48px;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 18px;
  --font-size-body: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;
  
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows (minimal, for special cases) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

---

## Quick Reference Card

### Must-Know Values

| Property | Value |
|----------|-------|
| Background | `#09090b` |
| Card background | `#18181b` |
| Border color | `#3f3f46` |
| Primary text | `#fafafa` |
| Muted text | `#71717a` |
| Success/Emerald | `#10b981` |
| Error/Red | `#ef4444` |
| Page padding | `24px` |
| Card radius | `16px` |
| Button radius | `12px` |
| Button padding | `16px 24px` |
| Font | Inter |

---

*End of Design System Documentation*
