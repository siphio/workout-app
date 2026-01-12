# Clean Gains — Product Requirements Document

> PWA workout tracker for iPhone 16 Pro Max | Next.js 15 + Tailwind 4 + shadcn/ui + Supabase

---

## 1. Executive Summary

**Clean Gains** is a personal workout tracking PWA with a premium dark-mode aesthetic. It features Push/Pull/Legs rotation with completion-based scheduling (skipped days push forward, not skip), set tracking with previous performance comparison, persistent rest timers, and gamified post-workout summaries with weight comparisons.

**MVP Goal:** Fully functional workout logging with set tracking, rest timers, PR detection, progress visualization, and gamified completion—optimized for gym use with high contrast, large touch targets, and offline capability.

---

## 2. Core Principles

1. **Simplicity First** — Minimal UI, no unnecessary complexity
2. **Completion Over Perfection** — Skipped days push forward
3. **Gym-Optimized** — High contrast, 44×44pt touch targets, works with sweaty fingers
4. **Data-Forward** — Numbers speak; minimal motivational fluff
5. **Personal, Not Social** — Single-user, no community features

---

## 3. Target User

| Attribute | Detail |
|-----------|--------|
| Name | Marley |
| Device | iPhone 16 Pro Max (430×932) |
| Goal | Track PPL workouts consistently |
| Experience | Intermediate lifter, follows predefined program |

---

## 4. MVP Scope

### In Scope
- ✅ Home screen with workout day display and cycle dots
- ✅ Rest day handling (shows "REST DAY", Start button begins next rotation)
- ✅ Active workout with swipe navigation between exercises
- ✅ Set tracking (weight, reps, completion) with previous performance
- ✅ Editable completed sets
- ✅ Rest timer (persists across exercise swipes, audio/vibration)
- ✅ Auto-resume partial workouts within time window
- ✅ Post-workout summary with weight comparison gamification
- ✅ Progress dashboard (PRs, volume chart, streak, goals)
- ✅ Settings page
- ✅ PWA with offline support and push notifications

### Out of Scope
- ❌ Multi-user authentication
- ❌ Social features, sharing, leaderboards
- ❌ AI-generated programs
- ❌ Apple Watch/Health integration
- ❌ Exercise video library (placeholder only)

---

## 5. User Stories

| ID | Story | Example |
|----|-------|---------|
| US-1 | See what workout day it is | App shows "PUSH DAY" with cycle dots |
| US-2 | Start workout on rest day | Start button begins next rotation |
| US-3 | Log sets with weight/reps | Enter 80kg × 10, tap checkmark |
| US-4 | See previous performance | "PREVIOUS" column shows last session |
| US-5 | Edit completed sets | Tap completed set, modify values |
| US-6 | Swipe between exercises | Swipe right to see next exercise |
| US-7 | Rest timer persists | Timer continues when viewing different exercise |
| US-8 | Resume interrupted workout | Reopen within 20 min, progress preserved |
| US-9 | See rewarding summary | T-Rex graphic + "You lifted 12,450 kg" |
| US-10 | Track PRs | Summary shows "NEW RECORDS" with achievements |
| US-11 | View progress over time | Volume chart, PR cards with deltas |

---

## 6. Architecture

### Vertical Slice Structure

```
src/
├── features/
│   ├── home/
│   │   ├── components/
│   │   │   ├── hero-section.tsx
│   │   │   ├── workout-card.tsx
│   │   │   └── cycle-dots.tsx
│   │   ├── hooks/
│   │   │   └── use-schedule.ts
│   │   └── page.tsx
│   │
│   ├── workout/
│   │   ├── components/
│   │   │   ├── exercise-card.tsx
│   │   │   ├── set-row.tsx
│   │   │   ├── set-table.tsx
│   │   │   ├── rest-timer.tsx
│   │   │   ├── swipe-container.tsx
│   │   │   └── video-placeholder.tsx
│   │   ├── hooks/
│   │   │   ├── use-workout.ts
│   │   │   ├── use-rest-timer.ts
│   │   │   └── use-swipe-navigation.ts
│   │   ├── actions/
│   │   │   └── workout-actions.ts
│   │   └── page.tsx
│   │
│   ├── summary/
│   │   ├── components/
│   │   │   ├── comparison-graphic.tsx
│   │   │   ├── stats-row.tsx
│   │   │   └── pr-list.tsx
│   │   ├── hooks/
│   │   │   └── use-summary-data.ts
│   │   └── page.tsx
│   │
│   ├── progress/
│   │   ├── components/
│   │   │   ├── streak-card.tsx
│   │   │   ├── pr-card.tsx
│   │   │   ├── volume-chart.tsx
│   │   │   └── goal-card.tsx
│   │   ├── hooks/
│   │   │   └── use-progress-data.ts
│   │   └── page.tsx
│   │
│   └── settings/
│       ├── components/
│       │   ├── profile-section.tsx
│       │   ├── preferences-section.tsx
│       │   └── data-section.tsx
│       ├── hooks/
│       │   └── use-settings.ts
│       └── page.tsx
│
├── shared/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── bottom-nav.tsx
│   │   └── page-header.tsx
│   ├── hooks/
│   │   └── use-supabase.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── database.types.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # → features/home
│   ├── workout/page.tsx        # → features/workout
│   ├── summary/page.tsx        # → features/summary
│   ├── progress/page.tsx       # → features/progress
│   └── settings/page.tsx       # → features/settings
│
├── public/
│   ├── manifest.json
│   └── images/
│       ├── comparisons/
│       └── heroes/
│
└── styles/
    └── globals.css
```

### Why Vertical Slice?
- **Feature cohesion** — All code for a feature lives together
- **Easy navigation** — Find everything related to "workout" in one folder
- **Reduced coupling** — Features don't import across boundaries
- **Scalable** — Add features without touching others

---

## 7. Technology Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui, Lucide icons |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL 15) |
| PWA | @serwist/next, Web Push API |
| Tools | pnpm, ESLint, Prettier, Vitest |
| MCP | Archon (RAG + tasks), shadcn (components), Playwright (validation) |

---

## 8. Database Schema

```sql
-- Users (single user for MVP)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Marley',
  weight_unit TEXT DEFAULT 'kg',
  default_rest_seconds INTEGER DEFAULT 90,
  timer_sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout types
CREATE TABLE workout_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_type_id UUID REFERENCES workout_types(id),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  default_sets INTEGER NOT NULL,
  target_reps_min INTEGER NOT NULL,
  target_reps_max INTEGER NOT NULL,
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  notes TEXT
);

-- Workout logs
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  workout_type_id UUID REFERENCES workout_types(id),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  total_volume DECIMAL,
  duration_seconds INTEGER
);

-- Set logs
CREATE TABLE set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES workout_logs(id),
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight DECIMAL NOT NULL,
  reps INTEGER NOT NULL,
  is_pr BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exercise_id UUID REFERENCES exercises(id),
  pr_type TEXT NOT NULL CHECK (pr_type IN ('max_weight', 'weight_at_reps', 'max_volume')),
  value DECIMAL NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL
);

-- Schedule state
CREATE TABLE schedule_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  cycle_position INTEGER DEFAULT 0 CHECK (cycle_position BETWEEN 0 AND 3),
  last_completed_at TIMESTAMPTZ
);

-- Weight comparisons
CREATE TABLE weight_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_weight DECIMAL NOT NULL,
  max_weight DECIMAL NOT NULL,
  comparison_name TEXT NOT NULL,
  image_filename TEXT NOT NULL
);
```

---

## 9. Workout Program

> Full details: `WORKOUT_PROGRAM.md`

### Schedule Rotation
```
0 → Push | 1 → Pull | 2 → Legs | 3 → Rest | (repeat)
```
Advances only on workout completion, not calendar.

### Push Day — 19 sets

| Exercise | Sets | Reps | Rest |
|----------|------|------|------|
| Barbell Bench Press | 4 | 6-8 | 180s |
| Seated DB Shoulder Press | 3 | 8-10 | 120s |
| Incline DB Press | 3 | 8-12 | 90s |
| Cable Lateral Raises | 3 | 12-15 | 60s |
| Tricep Pushdowns (Rope) | 3 | 10-12 | 60s |
| Overhead Tricep Extension | 3 | 10-12 | 60s |

### Pull Day — 20 sets

| Exercise | Sets | Reps | Rest |
|----------|------|------|------|
| Barbell Deadlift | 4 | 5-6 | 210s |
| Weighted Pull-Ups | 4 | 6-10 | 150s |
| Barbell Bent Over Row | 3 | 8-10 | 120s |
| Face Pulls | 3 | 15-20 | 60s |
| Barbell Curls | 3 | 8-10 | 60s |
| Hammer Curls | 3 | 10-12 | 60s |

### Legs Day — 20 sets

| Exercise | Sets | Reps | Rest |
|----------|------|------|------|
| Barbell Back Squat | 4 | 6-8 | 180s |
| Romanian Deadlift | 3 | 8-10 | 120s |
| Leg Press | 3 | 10-12 | 120s |
| Leg Curl | 3 | 10-12 | 90s |
| Leg Extension | 3 | 12-15 | 60s |
| Standing Calf Raises | 4 | 12-15 | 60s |

### Progressive Overload
- Add reps until hitting top of range for all sets
- Add weight, drop to bottom of rep range
- Increments: Compounds 5kg, Upper barbell 2.5kg, DB 2kg, Cable 2.5kg

---

## 10. Feature Specifications

### 10.1 Home Screen

**Layout:**
- Hero section (55% of screen): Geometric emerald background (static placeholder for MVP)
- Bottom card: Surface color (#18181b), 24px top radius
- Greeting: "Hello, it's" in muted gray (#a1a1aa)
- Workout title: "[PUSH/PULL/LEGS/REST] DAY" in white, 32px bold
- User name: "Marley" in emerald (#10b981), 24px semibold
- CTA: White button, black text, 56px height, full width
- Cycle dots: 4 dots showing position, active in emerald

**Behavior:**
- Displays next pending workout based on completion state
- Rest Day: Shows "REST DAY" with Start button → begins next rotation (Push after Legs-Rest)
- Tapping "START WORKOUT" navigates to `/workout`

### 10.2 Active Workout

**Header:**
- Back arrow (returns to home with confirmation if in progress)
- Workout title ("PUSH DAY")
- Elapsed timer in emerald
- Pause button

**Exercise Card:**
- Exercise name (e.g., "BARBELL BENCH PRESS")
- Position indicator (e.g., "Exercise 1 of 6")
- Video placeholder (16:9) with play icon and "Form Guide" label

**Set Table:**

| Column | Width | Content |
|--------|-------|---------|
| SET | 40px | Set number (1, 2, 3...) |
| PREVIOUS | flex | Last session's weight × reps |
| KG | 60px | Weight input field |
| REPS | 60px | Reps input field |
| ✓ | 40px | Checkbox/checkmark |

**Row States:**
- Completed: Emerald checkmark, normal text
- Active: Emerald left border (3px), input fields editable
- Upcoming: Muted text (#71717a), empty checkbox

**Additional Elements:**
- "+ Add Set" text button below table
- Notes section (expandable, 300 char max)

**Navigation:**
- Swipe left: Next exercise
- Swipe right: Previous exercise
- Visual indicator of position in exercise list

### 10.3 Rest Timer

**Layout:**
- Fixed bottom bar, 64px height
- Clock icon + "REST" label
- Countdown timer (e.g., "1:32")
- Progress bar (emerald fill, 4px radius)
- "Skip" text button

**Behavior:**
- Auto-starts when set is checked off
- Default duration from user settings (default 90s)
- Continues counting across exercise swipes
- Skip immediately (no confirmation)
- Audio + vibration notification when complete (if enabled)
- User can interact with workout screen during rest

### 10.4 Resume Logic

**Window Calculation:**
```
scheduled_duration = (exercises × sets × rest_time) + (exercises × sets × 45s)
resume_window = scheduled_duration + 20 minutes
```

**Behavior:**
- Active workout stored in localStorage with timestamp
- On app open: Check for active workout within resume window
- Within window: Show workout screen with all progress preserved
- Outside window: Clear active workout, show home screen
- Completed sets, notes, and current position all preserved

### 10.5 Post-Workout Summary

**Layout:**
- Success header: Emerald checkmark in circle + "WORKOUT COMPLETE"
- Comparison card:
  - Low-poly geometric illustration (T-Rex for MVP)
  - "You lifted" subtitle
  - Total weight in 48px bold white
  - "That's equivalent to a [COMPARISON]!" in emerald
- Stats row: Duration | Sets | Exercises (with emerald icons)
- New Records section (if applicable): Trophy emoji, bulleted PRs
- Share button (white primary)
- Done button (outline secondary)

**Weight Comparison Thresholds:**

| Weight Range (kg) | Comparison |
|-------------------|------------|
| 500 - 1,500 | Baby Elephant |
| 1,500 - 3,000 | Grand Piano |
| 3,000 - 5,000 | Small Car |
| 5,000 - 8,000 | Helicopter |
| 8,000 - 12,000 | T-Rex |
| 12,000 - 18,000 | African Elephant |
| 18,000 - 30,000 | School Bus |
| 30,000+ | Blue Whale |

*Note: Only T-Rex graphic for MVP; others show placeholder.*

### 10.6 Progress Dashboard

**Layout:**
- Header: "PROGRESS" + settings gear icon
- Streak card: Fire emoji + consecutive weeks count + "Keep it going!"
- Personal Records: 3 horizontal cards
  - Exercise name (Bench, Squat, Deadlift)
  - Current PR weight
  - Delta indicator ("+Xkg ↑" in emerald)
- Volume chart:
  - Line graph with emerald line/area fill
  - Time filter pills: 1M | 3M | 1Y
  - Y-axis: Volume (kg), X-axis: Date
- Goals section:
  - Target emoji
  - Goal text (e.g., "Bench 100kg by March")
  - Progress bar
  - Percentage complete
- Bottom navigation: 4 tabs (Home, Workout, Progress, Profile)

### 10.7 Settings

**Sections:**

**Profile**
- Avatar placeholder (circle, 64px)
- Name: "Marley"
- Email: "marley@email.com"
- Edit link (emerald)

**Workout Preferences**
- Weight unit: kg/lbs dropdown
- Default rest timer: 60s/90s/120s/180s dropdown
- Timer sound: Toggle (emerald on, zinc off)
- Vibration: Toggle

**Notifications**
- Workout reminders: Toggle
- Rest day alerts: Toggle

**Data**
- Export workout data: Row with arrow
- Clear all data: Red text, requires confirmation modal

**Footer**
- Sign out button (outline)
- App version: "App Version 1.0.0"

---

## 11. Design System Reference

> Full details: `design-assets/brand/DESIGN_SYSTEM.md`

### Quick Reference

| Token | Value |
|-------|-------|
| Background | `#09090b` |
| Surface | `#18181b` |
| Border | `#3f3f46` |
| Text Primary | `#fafafa` |
| Text Muted | `#71717a` |
| Success | `#10b981` |
| Error | `#ef4444` |
| Page padding | 24px |
| Card radius | 16px |
| Button radius | 12px |
| Font | Inter |
| Touch target | 44×44pt min |

---

## 12. Implementation Phases

### Validation Strategy

Each phase uses **Playwright MCP** for front-end validation:
```
browser_resize({ width: 430, height: 932 })  # iPhone 16 Pro Max
browser_navigate({ url: "..." })
browser_snapshot()
browser_click({ element: "...", ref: "[ref]" })
browser_wait_for({ text: "..." })
browser_take_screenshot({ filename: "..." })
```

---

### Phase 1: Foundation

**Deliverables:**
- Next.js 15 + TypeScript + Tailwind 4 + shadcn/ui
- Supabase local dev + schema + migrations + seed data
- Vertical slice folder structure
- All 5 routes with placeholders
- CSS variables matching design system

**Validation:**
```
browser_navigate({ url: "http://localhost:3000" })
browser_resize({ width: 430, height: 932 })
browser_take_screenshot({ filename: "phase1-home.png" })

# Test all routes
browser_navigate({ url: "http://localhost:3000/workout" })
browser_navigate({ url: "http://localhost:3000/summary" })
browser_navigate({ url: "http://localhost:3000/progress" })
browser_navigate({ url: "http://localhost:3000/settings" })

# Verify design tokens
browser_evaluate({ function: "() => getComputedStyle(document.body).backgroundColor" })
browser_console_messages({ onlyErrors: true })
```

---

### Phase 2: Core Workout Flow

**Deliverables:**
- Home screen with workout day logic + cycle dots
- Rest day handling
- Active workout with set table
- Swipe navigation between exercises
- Set completion + editable sets
- Rest timer (persistent bottom bar)
- Supabase persistence
- Schedule advancement
- Resume logic

**Validation:**
```
# Home
browser_navigate({ url: "http://localhost:3000" })
browser_wait_for({ text: "PUSH DAY" })

# Start workout
browser_click({ element: "Start Workout", ref: "[ref]" })
browser_wait_for({ text: "Barbell Bench Press" })

# Log set
browser_type({ element: "Weight input", ref: "[ref]", text: "80" })
browser_type({ element: "Reps input", ref: "[ref]", text: "8" })
browser_click({ element: "Checkmark", ref: "[ref]" })

# Rest timer
browser_wait_for({ text: "REST" })

# Swipe navigation
browser_press_key({ key: "ArrowRight" })
browser_wait_for({ text: "Seated Dumbbell Shoulder Press" })

# Verify timer persists
browser_wait_for({ text: "REST" })

# Complete workout → verify schedule advances
browser_navigate({ url: "http://localhost:3000" })
browser_wait_for({ text: "PULL DAY" })
```

---

### Phase 3: Summary & Progress

**Deliverables:**
- Post-workout summary with stats + comparison
- PR detection + display
- Progress dashboard (streak, PRs, chart, goals)
- Settings page (all sections)
- Bottom navigation

**Validation:**
```
# Summary
browser_wait_for({ text: "WORKOUT COMPLETE" })
browser_wait_for({ text: "kg" })
browser_wait_for({ text: "T-Rex" })

# Progress
browser_navigate({ url: "http://localhost:3000/progress" })
browser_wait_for({ text: "Streak" })
browser_wait_for({ text: "Bench" })

# Chart filters
browser_click({ element: "1M filter", ref: "[ref]" })
browser_click({ element: "3M filter", ref: "[ref]" })

# Settings
browser_navigate({ url: "http://localhost:3000/settings" })
browser_click({ element: "Timer Sound toggle", ref: "[ref]" })

# Bottom nav
browser_click({ element: "Home nav", ref: "[ref]" })
browser_wait_for({ text: "DAY" })
```

---

### Phase 4: PWA & Polish

**Deliverables:**
- PWA manifest + service worker
- Push notifications for rest timer
- Offline support
- App icons
- Hero background placeholder
- Performance optimization
- UI polish matching mockups

**Validation:**
```
# PWA manifest
browser_evaluate({ function: "() => fetch('/manifest.json').then(r => r.json())" })

# Service worker
browser_evaluate({ function: "() => navigator.serviceWorker.ready.then(r => r.active ? 'ok' : 'pending')" })

# Visual regression - all screens
browser_take_screenshot({ filename: "final-home.png", fullPage: true })
browser_take_screenshot({ filename: "final-workout.png", fullPage: true })
browser_take_screenshot({ filename: "final-summary.png", fullPage: true })
browser_take_screenshot({ filename: "final-progress.png", fullPage: true })
browser_take_screenshot({ filename: "final-settings.png", fullPage: true })

# Touch targets (44×44 min)
browser_evaluate({
  function: `() => {
    const btns = document.querySelectorAll('button, a, [role="button"]');
    return [...btns].filter(b => {
      const r = b.getBoundingClientRect();
      return r.width < 44 || r.height < 44;
    }).length;
  }`
})
# Expected: 0

browser_console_messages({ onlyErrors: true })
```

**Compare to Mockups:**

| Screen | Mockup |
|--------|--------|
| Home | `design-assets/ui-screens/home-screen-ui.png` |
| Workout | `design-assets/ui-screens/active-workout-ui.png` |
| Summary | `design-assets/ui-screens/post-workout-summary.png` |
| Progress | `design-assets/ui-screens/progress-dashboard-ui.png` |
| Settings | `design-assets/ui-screens/settings-ui.png` |

---

## 13. Success Criteria

- [ ] Home shows correct workout day based on completion state
- [ ] Rest day allows starting next rotation
- [ ] Can complete full workout with all sets logged
- [ ] Swipe navigation works between exercises
- [ ] Rest timer persists across swipes
- [ ] Completed sets are editable
- [ ] Workout resumes within time window
- [ ] Summary shows weight + comparison + PRs
- [ ] Progress charts display historical data
- [ ] Settings persist across sessions
- [ ] PWA installable on iPhone 16 Pro Max
- [ ] Offline mode works
- [ ] Touch targets ≥ 44×44pt
- [ ] UI matches design mockups

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| iOS PWA notification limits | In-app sound/vibration fallback, visible timer |
| Offline sync conflicts | Last-write-wins for MVP, preserve local data |
| Swipe vs iOS back gesture | Edge detection, visual affordances |
| Resume edge cases | Absolute timestamps, graceful timeout |
| Performance with history | Pagination, DB aggregations |

---

## 15. MCP Integration

### Archon (RAG + Tasks)
```
rag_search_knowledge_base(query="...", source_id="8651387df82a4ede")  # Next.js
rag_search_knowledge_base(query="...", source_id="9c5f534e51ee9237")  # Supabase
rag_search_knowledge_base(query="...", source_id="ec33815e5a584d70")  # shadcn
find_tasks(project_id="ed0ab2ee-9245-4a06-a90b-b305c966a79f")
```

### shadcn (Components)
```
search_items_in_registries(registries=["@shadcn"], query="button")
get_item_examples_from_registries(registries=["@shadcn"], query="card-demo")
```

### Playwright (Validation)
```
browser_navigate({ url: "..." })
browser_snapshot()
browser_click({ element: "...", ref: "[ref]" })
browser_take_screenshot({ filename: "..." })
```

---

## 16. Reference Files

| File | Purpose |
|------|---------|
| `WORKOUT_PROGRAM.md` | Full exercise program with progression |
| `design-assets/brand/DESIGN_SYSTEM.md` | Colors, typography, spacing, components |
| `design-assets/brand/Brand-guidlines.md` | Illustration style, asset specs |
| `design-assets/wireframes/UI-WIREFRAMES.md` | ASCII wireframes |
| `design-assets/ui-screens/*.png` | Visual mockups (5 screens) |

---

*Clean Gains PRD v2.0 — Vertical Slice Architecture*
