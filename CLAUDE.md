# Clean Gains - Development Rules

> PWA workout tracker for iPhone 16 Pro Max | Next.js 15 + Tailwind + shadcn/ui + Supabase

---

## Core Principles

- **Mobile-First PWA** - 430x932 viewport, 44x44pt touch targets, offline-capable
- **Server Components Default** - Only use `'use client'` for interactivity/browser APIs
- **Type Safety** - Strict TypeScript, no `any`, generated Supabase types
- **Design System Adherence** - Use design tokens exactly, reference `design-assets/`

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 15, React 19, TypeScript 5, Tailwind 4, shadcn/ui, Recharts, Lucide |
| Backend | Supabase (PostgreSQL 15), Supabase CLI for local dev |
| PWA | @serwist/next, Web Push API, Service Worker |
| Tools | pnpm, ESLint, Prettier, Vitest |

---

## Project Structure

```
app/                    # Next.js App Router pages
  ├── workout/          # Active workout screen
  ├── summary/          # Post-workout summary
  ├── progress/         # Progress dashboard
  └── settings/         # Settings page
components/
  ├── ui/               # shadcn/ui (auto-generated)
  └── [feature]/        # Feature-specific components
hooks/                  # Custom React hooks (use-*.ts)
lib/
  ├── supabase/         # client.ts, server.ts
  └── database.types.ts # Generated types
supabase/migrations/    # Database schema
design-assets/          # UI mockups (reference these!)
```

---

## Design System

### Colors (Tailwind Classes)
| Role | Class | Hex |
|------|-------|-----|
| Background | `bg-zinc-950` | #09090b |
| Surface | `bg-zinc-900` | #18181b |
| Elevated | `bg-zinc-800` | #27272a |
| Border | `border-zinc-700` | #3f3f46 |
| Text | `text-zinc-50` | #fafafa |
| Muted | `text-zinc-400` | #a1a1aa |
| Primary/Success | `text-emerald-500` | #10b981 |
| Error | `text-red-500` | #ef4444 |

### Typography
```
h1: text-[32px] font-bold       # Hero titles
h2: text-2xl font-semibold      # Section headers
h3: text-lg font-semibold       # Card titles
stats: text-5xl font-bold       # Large numbers
caption: text-xs text-zinc-400  # Labels
```

### Component Patterns
```tsx
// Primary button (white on dark)
<Button className="bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl px-6 py-4">

// Card
<Card className="bg-zinc-900 border-zinc-800 rounded-2xl p-5">

// Input
<Input className="bg-zinc-800 border-zinc-700 rounded-lg" />

// Success indicator
<Check className="h-5 w-5 text-emerald-500" />
```

---

## Code Conventions

### Naming
```
files:        kebab-case        exercise-card.tsx
hooks:        use-prefix        use-rest-timer.ts
components:   PascalCase        ExerciseCard
functions:    camelCase         calculateVolume()
constants:    SCREAMING_SNAKE   DEFAULT_REST_SECONDS
interfaces:   PascalCase        WorkoutLog
db fields:    snake_case        workout_type_id
```

### Component Template
```tsx
'use client';

import { cn } from '@/lib/utils';

interface Props { /* typed props */ }

export function ComponentName({ className, ...props }: Props) {
  return (
    <div className={cn('bg-zinc-900', className)}>
      {/* content */}
    </div>
  );
}
```

---

## Supabase Patterns

```typescript
// Server Component - data fetching
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('workout_logs').select('*');
  return <Component data={data} />;
}

// Client Component - mutations
'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
await supabase.from('set_logs').insert({ weight, reps });
```

---

## Commands

```bash
# Dev
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm lint && pnpm typecheck # Code quality

# Supabase
pnpm supabase start         # Start local DB (Docker)
pnpm supabase db push       # Apply migrations
pnpm supabase gen types typescript --local > lib/database.types.ts

# shadcn
pnpm dlx shadcn@latest add button card input table progress switch chart
```

---

## AI Assistant Rules

1. **Reference design-assets/** before implementing any UI
2. **Use shadcn MCP** - search `@shadcn` registry before creating custom components
3. **Use Archon MCP** - query docs for Next.js, Supabase, shadcn when uncertain
4. **Follow color tokens** - never hardcode hex values
5. **Server Components first** - only `'use client'` when necessary
6. **Generate types** after any schema change
7. **Check PRD..md** for feature specs and acceptance criteria
8. **Optimistic UI** - update local state immediately, sync in background

---

## MCP Quick Reference

### Archon (Docs & Tasks)
```
rag_search_knowledge_base(query="...", source_id="8651387df82a4ede")  # Next.js
rag_search_knowledge_base(query="...", source_id="9c5f534e51ee9237")  # Supabase
rag_search_knowledge_base(query="...", source_id="ec33815e5a584d70")  # shadcn
```

### shadcn (Components)
```
search_items_in_registries(registries=["@shadcn"], query="button")
get_item_examples_from_registries(registries=["@shadcn"], query="card-demo")
```

---

## Key Files

| File | Purpose |
|------|---------|
| `PRD..md` | Full product requirements |
| `design-assets/ui-screens/` | UI mockups to match |
| `supabase/migrations/` | Database schema |
| `lib/database.types.ts` | Generated Supabase types |
