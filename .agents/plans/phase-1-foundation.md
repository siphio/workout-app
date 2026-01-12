# Feature: Phase 1 Foundation - Clean Gains Workout App

The following plan should be complete, but validate documentation and codebase patterns before implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files.

---

## Feature Description

Set up the foundational infrastructure for the Clean Gains PWA workout tracker. This includes Next.js 15 project initialization, Tailwind CSS 4 configuration with the design system tokens, shadcn/ui component library setup, Supabase local development environment with complete database schema, and all 5 route placeholders following vertical slice architecture.

## User Story

As a developer building the Clean Gains workout app
I want a fully configured foundation with all tools, database schema, and route structure
So that I can implement features rapidly without setup friction

## Problem Statement

The Clean Gains workout app needs a solid technical foundation before any features can be built. This includes:
- Project scaffolding with Next.js 15 + TypeScript
- Design system implementation matching the UI mockups
- Database schema for workout tracking
- Vertical slice folder structure for feature organization
- All 5 screens with placeholder content

## Solution Statement

Implement Phase 1 Foundation by:
1. Initialize Next.js 15 with TypeScript, Tailwind 4, and shadcn/ui
2. Configure CSS variables matching the design system (zinc + emerald palette)
3. Set up Supabase local development with Docker
4. Create database migrations with complete schema and seed data
5. Establish vertical slice folder structure
6. Create all 5 route pages with placeholder content
7. Generate TypeScript types from Supabase schema

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: Build configuration, Database, Routing, Styling
**Dependencies**: Node.js 20+, pnpm, Docker, Supabase CLI

---

## CONTEXT REFERENCES

### Relevant Documentation Files - MUST READ BEFORE IMPLEMENTING

| File | Purpose | Key Sections |
|------|---------|--------------|
| `PRD.md` | Full product requirements | Section 6 (Architecture), Section 7 (Tech Stack), Section 8 (Database Schema) |
| `CLAUDE.md` | Development rules and conventions | Design System, Component Patterns, Supabase Patterns |
| `design-assets/brand/DESIGN_SYSTEM.md` | Complete design tokens | Colors, Typography, Spacing, CSS Variables |
| `WORKOUT_PROGRAM.md` | PPL workout program details | Exercise data for seeding |

### UI Mockups to Reference

| Screen | File | Key Design Elements |
|--------|------|---------------------|
| Home | `design-assets/ui-screens/home-screen-ui.png` | Hero section, bottom card, cycle dots |
| Workout | `design-assets/ui-screens/active-workout-ui.png` | Set table, rest timer bar |
| Summary | `design-assets/ui-screens/post-workout-summary.png` | T-Rex graphic, stats row |
| Progress | `design-assets/ui-screens/progress-dashboard.png` | PR cards, volume chart, bottom nav |
| Settings | `design-assets/ui-screens/settings-ui.png` | Settings rows, toggles |

### New Files to Create

```
workout-app/
├── app/
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page (redirect to features/home)
│   ├── workout/page.tsx              # Workout page placeholder
│   ├── summary/page.tsx              # Summary page placeholder
│   ├── progress/page.tsx             # Progress page placeholder
│   ├── settings/page.tsx             # Settings page placeholder
│   └── globals.css                   # Global styles with CSS variables
├── src/
│   ├── features/
│   │   ├── home/
│   │   │   └── page.tsx              # Home feature page
│   │   ├── workout/
│   │   │   └── page.tsx              # Workout feature page
│   │   ├── summary/
│   │   │   └── page.tsx              # Summary feature page
│   │   ├── progress/
│   │   │   └── page.tsx              # Progress feature page
│   │   └── settings/
│   │       └── page.tsx              # Settings feature page
│   └── shared/
│       ├── components/
│       │   └── ui/                   # shadcn/ui components (auto-generated)
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts         # Browser Supabase client
│       │   │   └── server.ts         # Server Supabase client
│       │   ├── database.types.ts     # Generated Supabase types
│       │   └── utils.ts              # cn() utility from shadcn
│       └── types/
│           └── index.ts              # Shared TypeScript types
├── supabase/
│   ├── config.toml                   # Supabase local config
│   ├── migrations/
│   │   └── 20240101000000_initial_schema.sql  # Database schema
│   └── seed.sql                      # Seed data for development
├── public/
│   ├── manifest.json                 # PWA manifest
│   └── images/
│       └── comparisons/
│           └── trex.png              # T-Rex comparison image
├── components.json                   # shadcn/ui config
├── tailwind.config.ts                # Tailwind configuration
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
└── middleware.ts                     # Supabase session middleware
```

### Relevant External Documentation

- [Next.js 15 App Router](https://nextjs.org/docs/app)
  - File conventions for app router
  - Why: Needed for proper routing structure
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/using-postcss)
  - CSS-first configuration
  - Why: Design system implementation
- [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)
  - Next.js installation guide
  - Why: Component library setup
- [Supabase SSR with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
  - Server/client setup pattern
  - Why: Database client configuration

### Patterns to Follow

**Color Tokens (from DESIGN_SYSTEM.md):**
```css
--color-background: #09090b;     /* zinc-950 */
--color-surface: #18181b;         /* zinc-900 */
--color-surface-elevated: #27272a; /* zinc-800 */
--color-border: #3f3f46;          /* zinc-700 */
--color-text-primary: #fafafa;    /* zinc-50 */
--color-text-secondary: #a1a1aa;  /* zinc-400 */
--color-text-muted: #71717a;      /* zinc-500 */
--color-success: #10b981;         /* emerald-500 */
--color-error: #ef4444;           /* red-500 */
```

**Component Naming:**
- Files: `kebab-case` (e.g., `exercise-card.tsx`)
- Components: `PascalCase` (e.g., `ExerciseCard`)
- Functions: `camelCase` (e.g., `calculateVolume`)
- DB fields: `snake_case` (e.g., `workout_type_id`)

**Server vs Client Components:**
```tsx
// Server Component (default) - no directive needed
export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('workouts').select('*');
  return <div>{/* content */}</div>;
}

// Client Component - requires 'use client' directive
'use client';
import { useState } from 'react';
export function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <button onClick={() => setState(true)}>Click</button>;
}
```

---

## IMPLEMENTATION PLAN

### Phase 1.1: Project Initialization

Set up Next.js 15 project with TypeScript, configure pnpm, and establish base project structure.

**Tasks:**
- Initialize Next.js 15 with TypeScript and App Router
- Configure pnpm as package manager
- Set up path aliases in tsconfig.json
- Install core dependencies

### Phase 1.2: Design System Configuration

Implement the design system tokens from DESIGN_SYSTEM.md in Tailwind and CSS variables.

**Tasks:**
- Configure Tailwind CSS 4 with custom colors
- Add CSS variables for design tokens
- Set up Inter font from Google Fonts
- Configure dark mode (forced dark)

### Phase 1.3: shadcn/ui Setup

Initialize shadcn/ui component library with zinc base color and install essential components.

**Tasks:**
- Initialize shadcn/ui with CLI
- Install base components (Button, Card, Input, Progress)
- Configure component.json for the project

### Phase 1.4: Supabase Setup

Set up Supabase local development environment with Docker and create database schema.

**Tasks:**
- Initialize Supabase local development
- Create initial migration with full schema
- Add seed data for development
- Generate TypeScript types

### Phase 1.5: Supabase Client Configuration

Create server and client Supabase utilities following the SSR pattern.

**Tasks:**
- Create server-side Supabase client
- Create browser-side Supabase client
- Set up middleware for session refresh
- Add environment variables

### Phase 1.6: Vertical Slice Structure

Create the feature-based folder structure and route placeholders.

**Tasks:**
- Create src/features directory structure
- Create src/shared directory structure
- Set up all 5 route pages with placeholders
- Create shared types file

### Phase 1.7: PWA Foundation

Set up basic PWA configuration with manifest.json.

**Tasks:**
- Create manifest.json with app metadata
- Configure Next.js for PWA
- Copy T-Rex image to public folder

---

## STEP-BY-STEP TASKS

### Task 1: CREATE Next.js Project

Initialize new Next.js 15 project with TypeScript and Tailwind CSS.

```bash
# In parent directory, create new Next.js project
pnpm create next-app@latest workout-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**VALIDATE:** `cd workout-app && pnpm dev` - should start on localhost:3000

---

### Task 2: UPDATE package.json

Add required dependencies and scripts.

**IMPLEMENT:** Add to package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:types": "supabase gen types typescript --local > src/shared/lib/database.types.ts"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.47.10",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.469.0",
    "recharts": "^2.15.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.0.0",
    "postcss": "^8.4.49"
  }
}
```

**VALIDATE:** `pnpm install` - should complete without errors

---

### Task 3: UPDATE tsconfig.json

Configure path aliases for the vertical slice structure.

**IMPLEMENT:** Update tsconfig.json paths
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/components/*": ["./src/shared/components/*"],
      "@/lib/*": ["./src/shared/lib/*"],
      "@/types/*": ["./src/shared/types/*"]
    },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**VALIDATE:** `pnpm typecheck` - should pass

---

### Task 4: CREATE globals.css with Design Tokens

Create the global CSS file with all design system tokens.

**IMPLEMENT:** Create `app/globals.css`
```css
@import "tailwindcss";

@theme {
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
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Font sizes with line heights */
  --font-size-stat: 48px;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 18px;
  --font-size-body: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

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

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* shadcn/ui CSS variables */
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  --chart-1: 220 70% 50%;
  --chart-2: 160 60% 45%;
  --chart-3: 30 80% 55%;
  --chart-4: 280 65% 60%;
  --chart-5: 340 75% 55%;
  --radius: 0.75rem;
}

html {
  color-scheme: dark;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Safe area insets for iPhone */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  body {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

**VALIDATE:** Visual check - background should be near-black (#09090b)

---

### Task 5: UPDATE tailwind.config.ts

Configure Tailwind with design system colors and custom utilities.

**IMPLEMENT:** Create `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Custom Clean Gains colors
        surface: {
          DEFAULT: "#18181b",
          elevated: "#27272a",
        },
        success: {
          DEFAULT: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        stat: ["48px", { lineHeight: "56px", letterSpacing: "-0.02em" }],
        h1: ["32px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        h2: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        h3: ["18px", { lineHeight: "28px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px", letterSpacing: "0.02em" }],
        label: ["12px", { lineHeight: "16px", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
```

**VALIDATE:** `pnpm build` - should build without errors

---

### Task 6: CREATE Root Layout with Providers

Set up the root layout with Inter font and theme provider.

**IMPLEMENT:** Create `app/layout.tsx`
```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Clean Gains",
  description: "Personal workout tracker for Push/Pull/Legs",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clean Gains",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
```

**VALIDATE:** `pnpm dev` - page should render with Inter font

---

### Task 7: CREATE shadcn/ui Configuration

Initialize shadcn/ui with CLI and configure for the project.

**IMPLEMENT:** Run shadcn init
```bash
pnpm dlx shadcn@latest init -y --defaults
```

Then update `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  },
  "iconLibrary": "lucide"
}
```

**VALIDATE:** `cat components.json` - should show zinc base color

---

### Task 8: CREATE Utils File for shadcn

Create the cn() utility function for class name merging.

**IMPLEMENT:** Create `src/shared/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**VALIDATE:** `pnpm typecheck` - should pass

---

### Task 9: ADD shadcn/ui Components

Install essential shadcn/ui components for the foundation.

**IMPLEMENT:** Run commands
```bash
pnpm dlx shadcn@latest add button card input progress
```

**VALIDATE:** `ls src/shared/components/ui/` - should show button.tsx, card.tsx, etc.

---

### Task 10: CREATE Supabase Configuration

Initialize Supabase local development environment.

**IMPLEMENT:** Run Supabase init
```bash
pnpm supabase init
```

Update `supabase/config.toml` with project settings:
```toml
[api]
enabled = true
port = 54321
schemas = ["public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
major_version = 15

[studio]
enabled = true
port = 54323

[auth]
enabled = true
site_url = "http://localhost:3000"
```

**VALIDATE:** `pnpm supabase start` - should start all services

---

### Task 11: CREATE Database Migration

Create the initial database schema migration.

**IMPLEMENT:** Create `supabase/migrations/20240101000000_initial_schema.sql`
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (single user for MVP)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Marley',
  email TEXT,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  default_rest_seconds INTEGER DEFAULT 90,
  timer_sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  workout_reminders_enabled BOOLEAN DEFAULT true,
  rest_day_alerts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout types (Push, Pull, Legs, Rest)
CREATE TABLE workout_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises linked to workout types
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_type_id UUID REFERENCES workout_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  default_sets INTEGER NOT NULL DEFAULT 3,
  target_reps_min INTEGER NOT NULL DEFAULT 8,
  target_reps_max INTEGER NOT NULL DEFAULT 12,
  rest_seconds INTEGER NOT NULL DEFAULT 90,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout logs (individual workout sessions)
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_type_id UUID REFERENCES workout_types(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  total_volume DECIMAL(10,2),
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set logs (individual sets within workouts)
CREATE TABLE set_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  is_pr BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records tracking
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  pr_type TEXT NOT NULL CHECK (pr_type IN ('max_weight', 'weight_at_reps', 'max_volume')),
  value DECIMAL(10,2) NOT NULL,
  reps INTEGER,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, pr_type)
);

-- Schedule state for PPL rotation
CREATE TABLE schedule_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  cycle_position INTEGER DEFAULT 0 CHECK (cycle_position BETWEEN 0 AND 3),
  last_completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weight comparisons for gamification
CREATE TABLE weight_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_weight DECIMAL(10,2) NOT NULL,
  max_weight DECIMAL(10,2) NOT NULL,
  comparison_name TEXT NOT NULL,
  image_filename TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals for progress tracking
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  target_weight DECIMAL(6,2) NOT NULL,
  target_date DATE,
  current_weight DECIMAL(6,2),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_workout_logs_started_at ON workout_logs(started_at DESC);
CREATE INDEX idx_set_logs_workout_log_id ON set_logs(workout_log_id);
CREATE INDEX idx_set_logs_exercise_id ON set_logs(exercise_id);
CREATE INDEX idx_personal_records_user_exercise ON personal_records(user_id, exercise_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to schedule_state table
CREATE TRIGGER update_schedule_state_updated_at
  BEFORE UPDATE ON schedule_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**VALIDATE:** `pnpm supabase db reset` - should apply migration without errors

---

### Task 12: CREATE Seed Data

Create seed data for development with complete workout program.

**IMPLEMENT:** Create `supabase/seed.sql`
```sql
-- Insert default user
INSERT INTO users (id, name, email, weight_unit, default_rest_seconds)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Marley',
  'marley@email.com',
  'kg',
  90
);

-- Insert workout types
INSERT INTO workout_types (id, name, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Push', 0),
  ('10000000-0000-0000-0000-000000000002', 'Pull', 1),
  ('10000000-0000-0000-0000-000000000003', 'Legs', 2),
  ('10000000-0000-0000-0000-000000000004', 'Rest', 3);

-- Insert Push Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Barbell Bench Press', 1, 4, 6, 8, 180, 'Compound strength focus. Retract shoulder blades, arch upper back slightly.'),
  ('10000000-0000-0000-0000-000000000001', 'Seated Dumbbell Shoulder Press', 2, 3, 8, 10, 120, 'Strict form, no leg drive. Keep core tight.'),
  ('10000000-0000-0000-0000-000000000001', 'Incline Dumbbell Press', 3, 3, 8, 12, 90, '30-45° angle. Press in slight arc.'),
  ('10000000-0000-0000-0000-000000000001', 'Cable Lateral Raises', 4, 3, 12, 15, 60, 'Control the negative. Lead with elbow.'),
  ('10000000-0000-0000-0000-000000000001', 'Tricep Pushdowns (Rope)', 5, 3, 10, 12, 60, 'Keep elbows pinned to sides. Spread rope at bottom.'),
  ('10000000-0000-0000-0000-000000000001', 'Overhead Tricep Extension', 6, 3, 10, 12, 60, 'Keep elbows pointed forward. Full stretch at bottom.');

-- Insert Pull Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Barbell Deadlift', 1, 4, 5, 6, 210, 'Strength focus, reset each rep. Push floor away.'),
  ('10000000-0000-0000-0000-000000000002', 'Weighted Pull-Ups', 2, 4, 6, 10, 150, 'Full dead hang at bottom. Pull elbows to hips.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Bent Over Row', 3, 3, 8, 10, 120, 'Overhand grip, 45° torso. Pull to lower chest.'),
  ('10000000-0000-0000-0000-000000000002', 'Face Pulls', 4, 3, 15, 20, 60, 'External rotation at top. Pull to ears.'),
  ('10000000-0000-0000-0000-000000000002', 'Barbell Curls', 5, 3, 8, 10, 60, 'No swinging. Keep elbows pinned.'),
  ('10000000-0000-0000-0000-000000000002', 'Hammer Curls', 6, 3, 10, 12, 60, 'Neutral grip throughout. Alternating or together.');

-- Insert Legs Day exercises
INSERT INTO exercises (workout_type_id, name, display_order, default_sets, target_reps_min, target_reps_max, rest_seconds, notes) VALUES
  ('10000000-0000-0000-0000-000000000003', 'Barbell Back Squat', 1, 4, 6, 8, 180, 'High bar, full depth. Drive through whole foot.'),
  ('10000000-0000-0000-0000-000000000003', 'Romanian Deadlift', 2, 3, 8, 10, 120, 'Feel hamstring stretch. Bar stays close to legs.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Press', 3, 3, 10, 12, 120, 'Feet shoulder width. Don''t lock knees at top.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Curl', 4, 3, 10, 12, 90, 'Squeeze at contraction. Slow negative.'),
  ('10000000-0000-0000-0000-000000000003', 'Leg Extension', 5, 3, 12, 15, 60, 'Pause at top. Control the descent.'),
  ('10000000-0000-0000-0000-000000000003', 'Standing Calf Raises', 6, 4, 12, 15, 60, 'Full ROM, pause at top. Rise onto big toe.');

-- Insert weight comparisons
INSERT INTO weight_comparisons (min_weight, max_weight, comparison_name, image_filename) VALUES
  (500, 1500, 'Baby Elephant', 'baby-elephant.png'),
  (1500, 3000, 'Grand Piano', 'grand-piano.png'),
  (3000, 5000, 'Small Car', 'small-car.png'),
  (5000, 8000, 'Helicopter', 'helicopter.png'),
  (8000, 12000, 'T-Rex', 'trex.png'),
  (12000, 18000, 'African Elephant', 'african-elephant.png'),
  (18000, 30000, 'School Bus', 'school-bus.png'),
  (30000, 999999, 'Blue Whale', 'blue-whale.png');

-- Initialize schedule state for user
INSERT INTO schedule_state (user_id, cycle_position, last_completed_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  0,
  NULL
);

-- Insert sample goals
INSERT INTO goals (user_id, exercise_id, target_weight, target_date, current_weight)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  100,
  '2025-03-01',
  85
FROM exercises e
WHERE e.name = 'Barbell Bench Press';

INSERT INTO goals (user_id, exercise_id, target_weight, target_date, current_weight)
SELECT
  '00000000-0000-0000-0000-000000000001',
  e.id,
  140,
  '2025-06-01',
  120
FROM exercises e
WHERE e.name = 'Barbell Back Squat';
```

**VALIDATE:** `pnpm supabase db reset` - should seed data successfully

---

### Task 13: CREATE Supabase Server Client

Create the server-side Supabase client for Server Components.

**IMPLEMENT:** Create `src/shared/lib/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
```

**VALIDATE:** `pnpm typecheck` - should pass (after types generated)

---

### Task 14: CREATE Supabase Browser Client

Create the client-side Supabase client for Client Components.

**IMPLEMENT:** Create `src/shared/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**VALIDATE:** `pnpm typecheck` - should pass

---

### Task 15: CREATE Middleware for Session Refresh

Create Next.js middleware to refresh Supabase sessions.

**IMPLEMENT:** Create `middleware.ts` (in project root)
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if exists
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**VALIDATE:** `pnpm build` - should build without errors

---

### Task 16: CREATE Environment Variables

Set up environment variables for local development.

**IMPLEMENT:** Create `.env.local`
```bash
# Supabase Local Development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**GOTCHA:** These are the default Supabase local development keys, safe to commit to .env.local.example

**VALIDATE:** Create `.env.local.example` with same content (no sensitive data)

---

### Task 17: GENERATE TypeScript Types

Generate TypeScript types from the Supabase schema.

**IMPLEMENT:** Run type generation
```bash
pnpm supabase gen types typescript --local > src/shared/lib/database.types.ts
```

**VALIDATE:** `cat src/shared/lib/database.types.ts` - should contain Database type

---

### Task 18: CREATE Shared Types File

Create shared TypeScript types for the application.

**IMPLEMENT:** Create `src/shared/types/index.ts`
```typescript
import { Database } from "@/shared/lib/database.types";

// Extract table types from generated Database type
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type WorkoutType = Database["public"]["Tables"]["workout_types"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];

export type WorkoutLog = Database["public"]["Tables"]["workout_logs"]["Row"];
export type WorkoutLogInsert = Database["public"]["Tables"]["workout_logs"]["Insert"];

export type SetLog = Database["public"]["Tables"]["set_logs"]["Row"];
export type SetLogInsert = Database["public"]["Tables"]["set_logs"]["Insert"];

export type PersonalRecord = Database["public"]["Tables"]["personal_records"]["Row"];
export type ScheduleState = Database["public"]["Tables"]["schedule_state"]["Row"];
export type WeightComparison = Database["public"]["Tables"]["weight_comparisons"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];

// Custom types for UI
export type WorkoutDay = "Push" | "Pull" | "Legs" | "Rest";

export type CyclePosition = 0 | 1 | 2 | 3; // Push=0, Pull=1, Legs=2, Rest=3

export interface WorkoutWithExercises extends WorkoutType {
  exercises: Exercise[];
}

export interface SetRowData {
  setNumber: number;
  previousWeight: number | null;
  previousReps: number | null;
  currentWeight: number | null;
  currentReps: number | null;
  isCompleted: boolean;
  isActive: boolean;
}

export interface WorkoutSummary {
  totalVolume: number;
  durationMinutes: number;
  totalSets: number;
  totalExercises: number;
  newPRs: Array<{
    exerciseName: string;
    weight: number;
    reps: number;
  }>;
  comparison: WeightComparison | null;
}
```

**VALIDATE:** `pnpm typecheck` - should pass

---

### Task 19: CREATE Feature Folder Structure

Create the vertical slice feature directories.

**IMPLEMENT:** Create directories and placeholder files
```bash
# Create feature directories
mkdir -p src/features/home/components
mkdir -p src/features/home/hooks
mkdir -p src/features/workout/components
mkdir -p src/features/workout/hooks
mkdir -p src/features/workout/actions
mkdir -p src/features/summary/components
mkdir -p src/features/summary/hooks
mkdir -p src/features/progress/components
mkdir -p src/features/progress/hooks
mkdir -p src/features/settings/components
mkdir -p src/features/settings/hooks

# Create shared directories
mkdir -p src/shared/components/ui
mkdir -p src/shared/hooks
mkdir -p src/shared/lib/supabase
mkdir -p src/shared/types
```

**VALIDATE:** `tree src/features` - should show folder structure

---

### Task 20: CREATE Home Page Placeholder

Create the home page with placeholder content.

**IMPLEMENT:** Create `app/page.tsx`
```tsx
import { createClient } from "@/shared/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch schedule state for current user
  const { data: scheduleState } = await supabase
    .from("schedule_state")
    .select("cycle_position")
    .single();

  const cyclePosition = scheduleState?.cycle_position ?? 0;
  const workoutDays = ["PUSH", "PULL", "LEGS", "REST"];
  const currentDay = workoutDays[cyclePosition];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section - 55% of screen */}
      <div className="h-[55vh] bg-gradient-to-br from-zinc-900 to-emerald-900/20 relative">
        {/* Placeholder for geometric pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-zinc-800 rotate-45" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-emerald-900/50 rotate-12" />
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-surface -mt-8 rounded-t-3xl px-6 pt-8 pb-12 min-h-[45vh]">
        <p className="text-zinc-400 text-base mb-2">Hello, it&apos;s</p>

        <h1 className="text-h1 font-bold text-white mb-1">
          {currentDay} DAY
        </h1>

        <p className="text-h2 font-semibold text-emerald-500 mb-8">
          Marley
        </p>

        <a
          href="/workout"
          className="block w-full bg-white text-zinc-950 text-center font-semibold py-4 px-6 rounded-xl hover:bg-zinc-100 transition-colors"
        >
          START WORKOUT →
        </a>

        {/* Cycle Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((position) => (
            <div
              key={position}
              className={`w-2 h-2 rounded-full ${
                position === cyclePosition
                  ? "bg-emerald-500"
                  : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

**VALIDATE:** `pnpm dev` - navigate to `/` - should show home screen placeholder

---

### Task 21: CREATE Workout Page Placeholder

Create the workout page with placeholder content.

**IMPLEMENT:** Create `app/workout/page.tsx`
```tsx
import Link from "next/link";
import { ArrowLeft, Pause } from "lucide-react";

export default function WorkoutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <Link href="/" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold text-white">PUSH DAY</h1>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 font-mono">12:34</span>
          <Pause className="w-5 h-5 text-emerald-500" />
        </div>
      </header>

      {/* Exercise Card */}
      <div className="px-6 py-6">
        <div className="bg-surface rounded-2xl p-5 mb-4">
          <h2 className="text-xl font-bold text-white text-center">
            BENCH PRESS
          </h2>
          <p className="text-zinc-400 text-center text-sm mt-1">
            Exercise 1 of 6
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="bg-surface-elevated rounded-2xl aspect-video mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-zinc-600 flex items-center justify-center mb-2 mx-auto">
              <div className="w-0 h-0 border-l-[12px] border-l-zinc-400 border-y-[8px] border-y-transparent ml-1" />
            </div>
            <p className="text-zinc-400 text-sm">Form Guide</p>
          </div>
        </div>

        {/* Set Table Header */}
        <div className="grid grid-cols-5 gap-2 text-xs text-zinc-400 uppercase tracking-wide px-2 mb-3">
          <span>Set</span>
          <span>Previous</span>
          <span>KG</span>
          <span>Reps</span>
          <span className="text-center">✓</span>
        </div>

        {/* Set Rows - Placeholder */}
        {[1, 2, 3, 4].map((setNum) => (
          <div
            key={setNum}
            className={`grid grid-cols-5 gap-2 items-center py-3 px-2 ${
              setNum === 3 ? "border-l-2 border-emerald-500 bg-zinc-900/50" : ""
            }`}
          >
            <span className="text-white">{setNum}</span>
            <span className="text-zinc-400">80 × 10</span>
            <div className="bg-surface-elevated rounded-lg px-3 py-2 text-white text-center">
              {setNum < 3 ? "80" : "—"}
            </div>
            <div className="bg-surface-elevated rounded-lg px-3 py-2 text-white text-center">
              {setNum < 3 ? "10" : "—"}
            </div>
            <div className="flex justify-center">
              {setNum < 3 ? (
                <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-md border-2 border-zinc-600" />
              )}
            </div>
          </div>
        ))}

        <button className="text-zinc-400 text-sm mt-4 w-full text-center">
          + Add Set
        </button>
      </div>

      {/* Rest Timer Bar - Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-zinc-800 px-6 py-4 pb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">⏱</span>
            <span className="text-zinc-400">REST</span>
            <span className="text-white font-mono text-lg">1:32</span>
          </div>
          <button className="text-zinc-400">Skip</button>
        </div>
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 w-3/5 rounded-full" />
        </div>
      </div>
    </main>
  );
}
```

**VALIDATE:** Navigate to `/workout` - should show workout screen placeholder

---

### Task 22: CREATE Summary Page Placeholder

Create the summary page with placeholder content.

**IMPLEMENT:** Create `app/summary/page.tsx`
```tsx
import Link from "next/link";
import { Check, Clock, Dumbbell, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function SummaryPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        </div>
      </div>

      <h1 className="text-h2 font-bold text-white text-center mb-8">
        WORKOUT COMPLETE
      </h1>

      {/* Comparison Card */}
      <div className="bg-surface rounded-2xl p-6 mb-6">
        {/* T-Rex Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-48 h-48 relative">
            <Image
              src="/images/comparisons/trex.png"
              alt="T-Rex"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <p className="text-zinc-400 text-center mb-2">You lifted</p>
        <p className="text-stat font-bold text-white text-center mb-2">
          12,450 kg
        </p>
        <p className="text-emerald-500 text-center">
          That&apos;s equivalent to a T-Rex!
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex justify-around py-4 border-y border-zinc-800 mb-6">
        <div className="text-center">
          <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-white font-semibold">47 min</p>
        </div>
        <div className="text-center">
          <Dumbbell className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-white font-semibold">24 sets</p>
        </div>
        <div className="text-center">
          <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-white font-semibold">6 exercises</p>
        </div>
      </div>

      {/* New Records */}
      <div className="mb-8">
        <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
          NEW RECORDS 🏆
        </h2>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white">Bench Press: 85kg × 8</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-white">Shoulder Press: 40kg × 10</span>
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-white text-zinc-950 font-semibold py-4 px-6 rounded-xl">
          SHARE
        </button>
        <Link
          href="/"
          className="block w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl text-center"
        >
          DONE
        </Link>
      </div>
    </main>
  );
}
```

**VALIDATE:** Navigate to `/summary` - should show summary screen placeholder

---

### Task 23: CREATE Progress Page Placeholder

Create the progress dashboard page with placeholder content.

**IMPLEMENT:** Create `app/progress/page.tsx`
```tsx
import Link from "next/link";
import { Home, Dumbbell, TrendingUp, User, Settings } from "lucide-react";

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6">
        <h1 className="text-h1 font-bold text-white">PROGRESS</h1>
        <Link href="/settings">
          <Settings className="w-6 h-6 text-zinc-400" />
        </Link>
      </header>

      <div className="px-6 space-y-6">
        {/* Streak Card */}
        <div className="bg-surface rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-lg font-semibold text-white">4 Week Streak!</p>
              <p className="text-zinc-400 text-sm">Keep it going</p>
            </div>
          </div>
        </div>

        {/* Personal Records */}
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            PERSONAL RECORDS
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Bench", weight: "95 kg", delta: "+5 kg" },
              { name: "Squat", weight: "120 kg", delta: null },
              { name: "Deadlift", weight: "140 kg", delta: "+10 kg" },
            ].map((pr) => (
              <div
                key={pr.name}
                className="bg-surface rounded-xl p-4 text-center"
              >
                <p className="text-zinc-400 text-sm mb-1">{pr.name}</p>
                <p className="text-xl font-bold text-white">{pr.weight}</p>
                {pr.delta && (
                  <p className="text-emerald-500 text-sm">{pr.delta} ↑</p>
                )}
                {!pr.delta && <p className="text-zinc-600 text-sm">—</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Volume Chart */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide">
              TOTAL VOLUME
            </h2>
            <div className="flex gap-1">
              {["1M", "3M", "1Y"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 rounded-full text-sm ${
                    period === "3M"
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-2xl p-5 h-48 flex items-end">
            {/* Chart Placeholder */}
            <div className="w-full h-full flex items-end justify-around gap-2">
              {[40, 55, 45, 60, 75, 70, 85, 80, 90].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500/60 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            GOALS
          </h2>
          <div className="space-y-3">
            {[
              { goal: "Bench 100kg by March", progress: 85 },
              { goal: "Squat 140kg by June", progress: 40 },
            ].map((item) => (
              <div key={item.goal} className="bg-surface rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white">🎯 {item.goal}</p>
                  <span className="text-emerald-500 text-sm">
                    {item.progress}%
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-zinc-800 px-6 py-2 pb-8">
        <div className="flex justify-around">
          {[
            { icon: Home, label: "Home", href: "/", active: false },
            { icon: Dumbbell, label: "Workout", href: "/workout", active: false },
            { icon: TrendingUp, label: "Progress", href: "/progress", active: true },
            { icon: User, label: "Profile", href: "/settings", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 ${
                item.active ? "text-emerald-500" : "text-zinc-500"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
```

**VALIDATE:** Navigate to `/progress` - should show progress dashboard placeholder

---

### Task 24: CREATE Settings Page Placeholder

Create the settings page with placeholder content.

**IMPLEMENT:** Create `app/settings/page.tsx`
```tsx
import Link from "next/link";
import { ArrowLeft, Camera, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">SETTINGS</h1>
      </header>

      <div className="px-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-surface rounded-2xl p-5">
          <div className="flex justify-end mb-2">
            <button className="text-emerald-500 text-sm">Edit</button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-xl font-semibold text-white">Marley</p>
            <p className="text-zinc-400 text-sm">marley@email.com</p>
          </div>
        </div>

        {/* Workout Preferences */}
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            WORKOUT PREFERENCES
          </h2>
          <div className="bg-surface rounded-2xl divide-y divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Weight Unit</span>
              <span className="text-zinc-400">kg ▼</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Default Rest Timer</span>
              <span className="text-zinc-400">90s ▼</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Timer Sound</span>
              <div className="w-12 h-7 rounded-full bg-emerald-500 relative">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Vibration</span>
              <div className="w-12 h-7 rounded-full bg-emerald-500 relative">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            NOTIFICATIONS
          </h2>
          <div className="bg-surface rounded-2xl divide-y divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Workout Reminders</span>
              <div className="w-12 h-7 rounded-full bg-emerald-500 relative">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Rest Day Alerts</span>
              <div className="w-12 h-7 rounded-full bg-zinc-700 relative">
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Data */}
        <div>
          <h2 className="text-label font-medium text-zinc-400 uppercase tracking-wide mb-3">
            DATA
          </h2>
          <div className="bg-surface rounded-2xl divide-y divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-white">Export Workout Data</span>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-red-500">Clear All Data</span>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button className="w-full border border-zinc-700 text-white font-semibold py-4 px-6 rounded-xl">
          SIGN OUT
        </button>

        <p className="text-center text-zinc-500 text-sm">App Version 1.0.0</p>
      </div>
    </main>
  );
}
```

**VALIDATE:** Navigate to `/settings` - should show settings screen placeholder

---

### Task 25: CREATE PWA Manifest

Create the PWA manifest for app installation.

**IMPLEMENT:** Create `public/manifest.json`
```json
{
  "name": "Clean Gains",
  "short_name": "Clean Gains",
  "description": "Personal workout tracker for Push/Pull/Legs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**VALIDATE:** Check manifest loads at `/manifest.json`

---

### Task 26: COPY T-Rex Image

Copy the T-Rex comparison image to the public folder.

**IMPLEMENT:** Run copy command
```bash
mkdir -p public/images/comparisons
cp design-assets/ui-screens/trex.png public/images/comparisons/trex.png
```

**VALIDATE:** Image accessible at `/images/comparisons/trex.png`

---

### Task 27: UPDATE Next.js Config

Configure Next.js for PWA and image optimization.

**IMPLEMENT:** Update `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
```

**VALIDATE:** `pnpm build` - should complete successfully

---

## TESTING STRATEGY

### Unit Tests

No unit tests required for Phase 1 Foundation. Unit testing will begin in Phase 2 with feature implementation.

### Integration Tests

Verify all routes render and Supabase connection works:

```bash
# Start dev server and verify all routes
pnpm dev

# In another terminal, check routes
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3000/workout | head -20
curl -s http://localhost:3000/summary | head -20
curl -s http://localhost:3000/progress | head -20
curl -s http://localhost:3000/settings | head -20
```

### Edge Cases

- Supabase not running: Pages should still render (graceful degradation)
- Missing environment variables: Clear error message
- Invalid database schema: Migration should fail with descriptive error

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
# TypeScript type checking
pnpm typecheck

# ESLint (must pass with 0 errors)
pnpm lint

# Build check
pnpm build
```

**Expected**: All commands pass with exit code 0

### Level 2: Development Server

```bash
# Start Supabase
pnpm supabase start

# Start dev server
pnpm dev
```

**Expected**: Dev server starts on localhost:3000 without errors

### Level 3: Database Verification

```bash
# Reset database with migrations and seed
pnpm supabase db reset

# Generate types
pnpm supabase:types

# Verify types file exists
cat src/shared/lib/database.types.ts | head -50
```

**Expected**: Types generated with Database interface

### Level 4: Manual Validation

Navigate to each route in browser at 430×932 viewport (iPhone 16 Pro Max):

| Route | Expected Content |
|-------|-----------------|
| `/` | Home screen with "PUSH DAY" and cycle dots |
| `/workout` | Workout screen with exercise card and set table |
| `/summary` | Summary with T-Rex image and stats |
| `/progress` | Progress dashboard with PR cards and chart |
| `/settings` | Settings with profile and preferences |

### Level 5: Supabase Studio

```bash
# Open Supabase Studio
open http://localhost:54323
```

**Expected**: Tables visible with seed data populated

---

## ACCEPTANCE CRITERIA

- [x] Next.js 15 project initialized with TypeScript and Tailwind CSS 4
- [x] Design system tokens configured (colors, typography, spacing)
- [x] shadcn/ui installed with Button, Card, Input, Progress components
- [x] Supabase local development running with complete schema
- [x] All 8 database tables created with proper relationships
- [x] Seed data populates workout program (Push, Pull, Legs exercises)
- [x] TypeScript types generated from Supabase schema
- [x] Server and client Supabase utilities created
- [x] Session middleware configured
- [x] Vertical slice folder structure established
- [x] All 5 route pages render with placeholder content
- [x] PWA manifest created
- [x] T-Rex image in public folder
- [x] Build passes without errors
- [x] Type checking passes without errors

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully:
  - [ ] Level 1: typecheck, lint, build
  - [ ] Level 2: dev server starts
  - [ ] Level 3: database reset and types generated
  - [ ] Level 4: all 5 routes render correctly
  - [ ] Level 5: Supabase Studio shows tables
- [ ] Full test suite passes (unit + integration)
- [ ] No linting errors (pnpm lint)
- [ ] No type checking errors (pnpm typecheck)
- [ ] Build succeeds (pnpm build)
- [ ] All acceptance criteria met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

### Design Decisions

1. **Vertical Slice Architecture**: Chosen over traditional layered architecture to keep feature code co-located. Each feature (home, workout, summary, progress, settings) has its own components, hooks, and actions.

2. **Server Components Default**: Following Next.js 15 best practices, all pages are Server Components by default. Client Components only added when interactivity is required.

3. **CSS Variables for Design Tokens**: Using CSS custom properties allows runtime theming and integration with shadcn/ui's theming system.

4. **Single User MVP**: No authentication required for MVP. Single user record created in seed data.

5. **Supabase Local Development**: Using Docker-based Supabase for development provides a production-like environment without cloud dependencies.

### Risk Considerations

1. **Tailwind CSS 4 Breaking Changes**: Tailwind 4 uses CSS-first configuration. Some shadcn/ui components may need adjustment.

2. **Supabase SSR Package**: The `@supabase/ssr` package handles cookie-based auth correctly for Next.js App Router.

3. **PWA Service Worker**: Deferred to Phase 4. Basic manifest provides "Add to Home Screen" capability.

### Dependencies

- Node.js 20+ required
- Docker required for Supabase local development
- pnpm recommended as package manager (matches CLAUDE.md)
