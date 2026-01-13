# Feature: Glassmorphic Bottom Tab Bar Navigation

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

## Feature Description

Replace the current horizontal swipe-based navigation with a floating glassmorphic bottom tab bar. This change addresses three core issues:

1. **Competing Headers**: Current swipe navigation displays page labels at top, conflicting with individual page headers (e.g., "SETTINGS" appearing twice)
2. **Navigation Pattern Mismatch**: Swipe navigation suits homogeneous content; Clean Gains has three functionally distinct sections
3. **Gym Usability**: Users need quick, single-tap navigation while tired and sweaty between sets

## User Story

As a gym user
I want a persistent bottom tab bar with recognizable icons
So that I can quickly navigate between Home, Progress, and Settings with a single tap

## Problem Statement

The horizontal swipe navigation requires more cognitive effort than a fixed bottom bar, and creates visual conflicts with page-level headers. The swipe pattern gives equal weight to all pages when Home is the primary action 90% of the time.

## Solution Statement

Implement a floating glassmorphic bottom tab bar with 3 tabs (Home, Progress, Settings) using iOS-inspired design. Each page becomes a standalone route with its own header, and the tab bar provides consistent, always-visible navigation.

## Feature Metadata

**Feature Type**: Enhancement / Refactor
**Estimated Complexity**: Medium
**Primary Systems Affected**: Navigation, Layout, Home/Progress/Settings pages
**Dependencies**: None (using existing Lucide icons and Tailwind)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - READ BEFORE IMPLEMENTING

- `src/shared/components/bottom-nav.tsx` (full file) - **Why**: Existing bottom nav pattern to replace; shows current routing approach with `usePathname()`
- `src/shared/components/swipeable-pages.tsx` (full file) - **Why**: Current swipe implementation to remove
- `src/features/home/components/swipeable-home.tsx` (full file) - **Why**: Wrapper component to remove; understand current page composition
- `src/features/home/components/home-view.tsx` (lines 23-62) - **Why**: Bottom card positioning that needs padding adjustment
- `src/app/page.tsx` (full file) - **Why**: Root page using SwipeableHome; will be simplified
- `src/app/progress/page.tsx` (full file) - **Why**: Already has BottomNav; needs new tab bar
- `src/app/settings/page.tsx` (full file) - **Why**: No tab bar currently; needs addition
- `src/shared/components/page-header.tsx` (full file) - **Why**: Header styling patterns; Settings uses centered variant
- `src/app/globals.css` (lines 1-60) - **Why**: Design tokens and CSS variables for colors
- `src/shared/lib/utils.ts` - **Why**: `cn()` utility for className merging

### New Files to Create

- `src/shared/components/bottom-tab-bar.tsx` - Glassmorphic floating tab bar component

### Files to Modify

- `src/app/page.tsx` - Simplify to use HomeView + BottomTabBar
- `src/app/progress/page.tsx` - Replace BottomNav with BottomTabBar
- `src/app/settings/page.tsx` - Add BottomTabBar, remove back button
- `src/features/home/components/home-view.tsx` - Adjust bottom padding for tab bar
- `src/features/home/components/index.ts` - Remove SwipeableHome export

### Files to Delete (After Implementation)

- `src/shared/components/swipeable-pages.tsx` - No longer needed
- `src/features/home/components/swipeable-home.tsx` - No longer needed
- `src/shared/components/bottom-nav.tsx` - Replaced by new component

### Relevant Documentation

- [Tailwind backdrop-filter](https://tailwindcss.com/docs/backdrop-blur) - `backdrop-blur-xl` for glassmorphism
- [Next.js usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) - Client-side route detection
- [Lucide Icons](https://lucide.dev/icons/) - Home, BarChart3, Settings icons

### Patterns to Follow

**Component Structure** (from `bottom-nav.tsx`):
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart3, label: "Progress", href: "/progress" },
  { icon: Settings, label: "Settings", href: "/settings" },
];
```

**Glassmorphism CSS** (from proposal):
```tsx
className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl"
```

**Safe Area Handling** (from `page-header.tsx`):
```tsx
style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 12px)" }}
```

**Color Tokens**:
- Active tab: `text-emerald-500` (#10b981)
- Inactive tab: `text-zinc-500` (#71717a)
- Background: `bg-zinc-900/70` (semi-transparent)
- Border: `border-zinc-700/50`

**Touch Target Minimum**: 44×44px (per CLAUDE.md)

---

## IMPLEMENTATION PLAN

### Phase 1: Create New Tab Bar Component

Create the glassmorphic floating bottom tab bar as a reusable component with proper styling, safe area handling, and active state indication.

**Tasks:**
- Create `bottom-tab-bar.tsx` with glassmorphism effect
- Implement 3 tabs with Lucide icons
- Add active state detection using `usePathname()`
- Handle safe area insets for iPhone

### Phase 2: Update Page Routes

Modify each route page to use the new tab bar and become standalone (not wrapped in swipe container).

**Tasks:**
- Simplify home page to render HomeView + BottomTabBar
- Update Progress page to use new BottomTabBar
- Update Settings page to add BottomTabBar and adjust header
- Adjust bottom padding on all pages for tab bar clearance

### Phase 3: Update View Components

Modify view components to adjust padding and remove swipe-related assumptions.

**Tasks:**
- Adjust HomeView bottom card positioning for tab bar
- Remove swipe wrapper references from index exports

### Phase 4: Cleanup

Remove deprecated swipe navigation components and old bottom nav.

**Tasks:**
- Delete SwipeablePages component
- Delete SwipeableHome component
- Delete old BottomNav component
- Update exports in index files

---

## STEP-BY-STEP TASKS

### 1. CREATE `src/shared/components/bottom-tab-bar.tsx`

- **IMPLEMENT**: New glassmorphic floating tab bar component
- **PATTERN**: Mirror routing logic from `bottom-nav.tsx:15-36`
- **IMPORTS**: `"use client"`, Link, usePathname, {Home, BarChart3, Settings} from lucide-react, cn from utils
- **SPECIFICATIONS**:
  - Container: Pill shape, ~90% width, 64px height, fixed bottom
  - Position: 16px horizontal margins, 12px above safe area
  - Background: `bg-zinc-900/70` with `backdrop-blur-xl`
  - Border: `border border-zinc-700/50`
  - Border radius: `rounded-3xl` (24px)
  - Shadow: `shadow-lg shadow-black/20`
  - Tabs: 3 items (Home, Progress, Settings)
  - Icons: 24px Lucide icons
  - Active color: `text-emerald-500`
  - Inactive color: `text-zinc-500`
  - Touch targets: min 44×44px
  - NO labels (clean look per proposal Question 1)
  - Active indicator: color change only (per proposal Question 3)
- **GOTCHA**: Must use `-webkit-backdrop-filter` for Safari support
- **GOTCHA**: Must account for iPhone home indicator with safe area
- **VALIDATE**: `pnpm typecheck && pnpm lint`

```tsx
// Expected structure:
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const tabs = [
  { icon: Home, href: "/" },
  { icon: BarChart3, href: "/progress" },
  { icon: Settings, href: "/settings" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 12px) + 12px)" }}
    >
      <div className="flex items-center justify-around w-full max-w-[90%] h-16 bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-3xl shadow-lg shadow-black/20">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center justify-center w-16 h-16 transition-colors",
                isActive ? "text-emerald-500" : "text-zinc-500"
              )}
            >
              <tab.icon className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### 2. UPDATE `src/app/page.tsx`

- **IMPLEMENT**: Remove SwipeableHome, use HomeView + BottomTabBar
- **PATTERN**: Simple server component with data fetching
- **IMPORTS**: Add BottomTabBar from shared/components, keep HomeView from features/home
- **REMOVE**: SwipeableHome import and usage
- **REMOVE**: progressData and userSettings fetching (no longer needed on home page)
- **GOTCHA**: HomeView expects cyclePosition and currentDay props only
- **VALIDATE**: `pnpm typecheck && pnpm lint`

```tsx
// Expected structure:
import { HomeView } from "@/features/home/components";
import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

export default async function HomePage() {
  // Keep cycle position logic
  const cyclePosition = 0; // Or fetch from schedule_state
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  return (
    <>
      <HomeView cyclePosition={cyclePosition} currentDay={currentDay} />
      <BottomTabBar />
    </>
  );
}
```

### 3. UPDATE `src/features/home/components/home-view.tsx`

- **IMPLEMENT**: Adjust bottom card positioning to account for tab bar
- **CHANGE**: Bottom card `bottom-8` to `bottom-28` (112px = 64px tab bar + 48px margin)
- **PATTERN**: Existing positioning uses absolute positioning with Tailwind
- **GOTCHA**: Tab bar is ~88px total (64px height + safe area), need clearance
- **VALIDATE**: Visual check - card should not overlap tab bar

```tsx
// Change line 24:
// FROM: <div className="absolute bottom-8 left-4 right-4">
// TO:   <div className="absolute bottom-28 left-4 right-4">
```

### 4. UPDATE `src/app/progress/page.tsx`

- **IMPLEMENT**: Replace BottomNav with BottomTabBar
- **IMPORTS**: Change `BottomNav` to `BottomTabBar` from shared/components
- **REMOVE**: Old BottomNav import
- **KEEP**: All existing content and data fetching
- **KEEP**: pb-24 padding (already accounts for bottom nav)
- **VALIDATE**: `pnpm typecheck && pnpm lint`

```tsx
// Change import:
// FROM: import { BottomNav } from "@/shared/components/bottom-nav";
// TO:   import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

// Change component in JSX:
// FROM: <BottomNav />
// TO:   <BottomTabBar />
```

### 5. UPDATE `src/app/settings/page.tsx`

- **IMPLEMENT**: Add BottomTabBar, adjust header, add bottom padding
- **IMPORTS**: Add BottomTabBar from shared/components
- **CHANGE**: PageHeader - remove `backHref="/"` prop (no back button needed with tab bar)
- **CHANGE**: Add `pb-28` padding to main element for tab bar clearance
- **GOTCHA**: Settings mock shows back arrow, but tab bar replaces need for it
- **VALIDATE**: `pnpm typecheck && pnpm lint`

```tsx
// Expected changes:
import { BottomTabBar } from "@/shared/components/bottom-tab-bar";

// Change PageHeader:
// FROM: <PageHeader title="SETTINGS" backHref="/" />
// TO:   <PageHeader title="SETTINGS" />

// Change main padding:
// FROM: <main className="min-h-screen bg-zinc-950 pb-12">
// TO:   <main className="min-h-screen bg-zinc-950 pb-28">

// Add before closing </main>:
<BottomTabBar />
```

### 6. UPDATE `src/features/home/components/index.ts`

- **IMPLEMENT**: Remove SwipeableHome export
- **KEEP**: HomeView export
- **VALIDATE**: `pnpm typecheck`

```tsx
// Change from:
export { HomeView } from "./home-view";
export { SwipeableHome } from "./swipeable-home";

// To:
export { HomeView } from "./home-view";
```

### 7. DELETE `src/shared/components/swipeable-pages.tsx`

- **IMPLEMENT**: Delete file entirely
- **REASON**: No longer used after removing swipe navigation
- **VALIDATE**: `pnpm typecheck` (ensure no import errors)

### 8. DELETE `src/features/home/components/swipeable-home.tsx`

- **IMPLEMENT**: Delete file entirely
- **REASON**: No longer used after switching to tab-based navigation
- **VALIDATE**: `pnpm typecheck`

### 9. DELETE `src/shared/components/bottom-nav.tsx`

- **IMPLEMENT**: Delete file entirely
- **REASON**: Replaced by new BottomTabBar component
- **VALIDATE**: `pnpm typecheck`

### 10. VERIFY ALL ROUTES

- **VALIDATE**: Manual testing of all navigation flows
- **TEST**: `/` → Home with tab bar
- **TEST**: `/progress` → Progress with tab bar, active state
- **TEST**: `/settings` → Settings with tab bar, active state
- **TEST**: Tab switching works with single tap
- **TEST**: iPhone safe area insets (if device available)
- **VALIDATE**: `pnpm build` (production build succeeds)

---

## TESTING STRATEGY

### Unit Tests

No unit tests required for this UI refactor. The components are simple presentational elements with minimal logic.

### Integration Tests

Existing Playwright e2e tests should be updated if they rely on swipe navigation.

### Manual Testing Checklist

- [ ] Home page renders with tab bar at bottom
- [ ] Progress page renders with tab bar, Progress icon is emerald
- [ ] Settings page renders with tab bar, Settings icon is emerald
- [ ] Tapping Home icon navigates to `/`
- [ ] Tapping Progress icon navigates to `/progress`
- [ ] Tapping Settings icon navigates to `/settings`
- [ ] Tab bar has glassmorphism effect (semi-transparent blur)
- [ ] Tab bar floats above content with rounded corners
- [ ] Home card does not overlap tab bar
- [ ] Settings content does not overlap tab bar
- [ ] Tab bar respects iPhone safe area (home indicator clearance)
- [ ] Touch targets are comfortable (44×44px minimum)

### Edge Cases

- **Deep links**: Ensure direct navigation to `/progress` or `/settings` shows correct active state
- **Workout flow**: Tab bar should NOT appear on `/workout` or `/summary` pages
- **Page transitions**: Verify smooth transitions between tabs

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
# TypeScript type checking
pnpm typecheck

# ESLint
pnpm lint
```

**Expected**: All commands pass with exit code 0

### Level 2: Build

```bash
# Production build
pnpm build
```

**Expected**: Build succeeds without errors

### Level 3: Manual Validation

```bash
# Start dev server
pnpm dev

# Open in browser at iPhone 16 Pro Max size (430×932)
# Test all navigation flows
```

### Level 4: Visual Regression (Optional)

If Playwright is configured:
```bash
# Run e2e tests
pnpm playwright test
```

---

## ACCEPTANCE CRITERIA

- [ ] New `BottomTabBar` component created with glassmorphism styling
- [ ] Tab bar appears on Home, Progress, and Settings pages
- [ ] Tab bar does NOT appear on Workout or Summary pages
- [ ] Active tab indicated by emerald color
- [ ] Inactive tabs shown in zinc-500
- [ ] Tab bar is floating with rounded corners (pill shape)
- [ ] Tab bar has blur/transparency effect
- [ ] Single tap navigates between pages instantly
- [ ] No swipe navigation between pages
- [ ] No duplicate headers on any page
- [ ] Safe area insets handled for iPhone
- [ ] All validation commands pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Production build succeeds

---

## COMPLETION CHECKLIST

- [ ] Task 1: Created `bottom-tab-bar.tsx`
- [ ] Task 2: Updated `src/app/page.tsx`
- [ ] Task 3: Updated `home-view.tsx` padding
- [ ] Task 4: Updated `src/app/progress/page.tsx`
- [ ] Task 5: Updated `src/app/settings/page.tsx`
- [ ] Task 6: Updated `index.ts` exports
- [ ] Task 7: Deleted `swipeable-pages.tsx`
- [ ] Task 8: Deleted `swipeable-home.tsx`
- [ ] Task 9: Deleted `bottom-nav.tsx`
- [ ] Task 10: Verified all routes
- [ ] Level 1 validation passed (typecheck, lint)
- [ ] Level 2 validation passed (build)
- [ ] Level 3 validation passed (manual testing)
- [ ] All acceptance criteria met

---

## NOTES

### Design Decisions

1. **No labels on tabs**: Chosen for cleaner look. Icons are recognizable (House, Chart, Gear pattern is universal).

2. **Color-only active state**: No background pill or dot indicator. Simple color change from zinc-500 to emerald-500 is sufficient and matches existing design language.

3. **3 tabs instead of 4**: Removed "Workout" tab since it's an action triggered from Home, not a persistent destination. This simplifies navigation.

4. **Tab bar hidden during workout**: The Workout and Summary pages are modal flows that shouldn't show navigation - users should complete or exit the workout explicitly.

### Trade-offs

- **Removing swipe navigation**: Some users may prefer swipe, but the gym context prioritizes quick single-tap access over gesture navigation.

- **No animation on tab switch**: Instant page changes are faster for gym use. Animations can be added later if desired.

### Future Considerations

- Add subtle haptic feedback on tab tap
- Consider adding labels for first-time users (discoverable via onboarding)
- Add active indicator dot if user feedback suggests icons need more clarity
