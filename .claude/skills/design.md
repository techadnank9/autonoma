# Autonoma Design System & @autonoma/pond-ui Component Guidelines

> **Scope**: This skill covers UI development for Autonoma's product interfaces. Use these guidelines when creating or modifying components in `packages/pond-ui` or building UI in `apps/ui`.

## Quick Reference

| Aspect        | Product UI (@autonoma/pond-ui) | Marketing/Brand     |
|---------------|----------------------|---------------------|
| Theme         | Light-first          | Dark-first          |
| Primary Color | Indigo (#6366f1)     | Black + RGB glitch  |
| Font          | Geist                | Inter + Roboto Mono |
| Icons         | Lucide React         | Lucide              |
| Styling       | Tailwind + CVA       | Tailwind            |

---

## 1. Design Tokens

### Colors (from `src/lib/colors.ts`)

```typescript
// Primary - Indigo (use for interactive elements, focus states)
primary: {
  50: "#eef2ff",   // Subtle backgrounds
  100: "#e0e7ff",  // Hover backgrounds
  500: "#6366f1",  // Primary actions
  600: "#4f46e5",  // Primary hover
  700: "#4338ca",  // Primary active
}

// Semantic Status Colors
status: {
  passed: "#10b981",  // success[500] - Emerald
  failed: "#ef4444",  // error[500] - Red
  running: "#3b82f6", // info[500] - Blue
  pending: "#9ca3af", // gray[400]
  queued: "#9ca3af",  // gray[400]
  stopped: "#f97316", // warning[500] - Orange
}

// Grays - Neutral (most common in product UI)
gray: {
  50: "#f9fafb",   // Page backgrounds
  100: "#f3f4f6",  // Card backgrounds, subtle
  200: "#e5e7eb",  // Borders
  400: "#9ca3af",  // Muted text, icons
  500: "#6b7280",  // Secondary text
  600: "#4b5563",  // Body text
  900: "#111827",  // Headings
}
```

### Status-Based Styling Pattern

Always use consistent status colors across components:

```typescript
// Standard status style mapping
const getStatusStyles = (status: Status) => {
  switch (status) {
    case "passed":
      return {
        container: "bg-green-50 border-green-200",
        badge: "bg-green-100 text-green-800",
        icon: "text-emerald-600",
      }
    case "failed":
      return {
        container: "bg-red-50 border-red-200",
        badge: "bg-red-100 text-red-800",
        icon: "text-red-600",
      }
    case "running":
      return {
        container: "bg-white border-gray-200",
        badge: "bg-blue-100 text-blue-800",
        icon: "text-blue-600",
      }
    case "pending":
    default:
      return {
        container: "bg-white border-gray-200",
        badge: "bg-gray-100 text-gray-600",
        icon: "text-gray-400",
      }
  }
}
```

### Typography

- **Font Family**: Geist Sans (variable: `--font-geist-sans`)
- **Monospace**: Geist Mono (variable: `--font-geist-mono`)

```css
/* Sizing scale */
text-xs   /* 0.75rem - Badges, captions */
text-sm   /* 0.875rem - Body text, buttons */
text-base /* 1rem - Primary content */
text-lg   /* 1.125rem - Section headers */
text-xl   /* 1.25rem - Page titles */
```

### Spacing & Sizing

```css
/* Common spacing patterns */
gap-1     /* 0.25rem - Tight grouping (icon + text) */
gap-1.5   /* 0.375rem - Related items */
gap-2     /* 0.5rem - Standard spacing */
gap-4     /* 1rem - Section spacing */

/* Icon sizes */
size-3    /* 12px - Inline small */
size-3.5  /* 14px - Inline standard */
size-4    /* 16px - Standard */
size-5    /* 20px - Prominent */

/* Padding patterns */
px-2.5    /* Horizontal padding for cards */
py-1.5    /* Vertical padding for inputs */
p-4       /* Card/section padding */
```

### Border Radius

```css
rounded-sm   /* 2px - Subtle */
rounded      /* 4px - Inputs, small elements */
rounded-md   /* 6px - Cards */
rounded-lg   /* 8px - Modals, large cards */
rounded-full /* Pills, avatars, step numbers */
```

---

## 2. Component Architecture

### File Structure (@autonoma/pond-ui)

```
packages/pond-ui/src/
├── components/
│   ├── ui/              # Base shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── step-card.tsx    # Custom compound components
│   ├── data-list.tsx
│   └── ...
├── stories/             # Storybook files (@autonoma/pond-ui only)
│   └── StepCard.stories.tsx
├── lib/
│   ├── colors.ts        # Design tokens
│   ├── utils.ts         # cn() and helpers
│   └── status-utils.tsx # Shared status logic
└── styles.css           # CSS variables
```

### Component Template

```typescript
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"

// 1. Define variants with CVA (when needed)
const componentVariants = cva(
  "base-classes here",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        sm: "...",
        md: "...",
        lg: "...",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// 2. Export types
export type ComponentStatus = "passed" | "failed" | "running" | "pending"

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  /** Required prop with JSDoc comment */
  status: ComponentStatus
  /** Optional slots */
  children?: React.ReactNode
  actions?: React.ReactNode
}

// 3. Export component
export function Component({
  status,
  children,
  actions,
  className,
  variant,
  size,
  ...props
}: ComponentProps) {
  // Internal state
  const [isHovering, setIsHovering] = React.useState(false)
  
  // Computed styles
  const styles = getStatusStyles(status)

  return (
    <div
      className={cn(componentVariants({ variant, size }), styles.container, className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {children}
      {actions && isHovering && (
        <div className="flex items-center gap-1">{actions}</div>
      )}
    </div>
  )
}
```

### Key Patterns from Existing Components

#### Slot Pattern (from StepCard)
```typescript
interface StepCardProps {
  // Content slots
  children?: React.ReactNode        // Main content
  actions?: React.ReactNode         // Hover-revealed actions
  alwaysShowActions?: React.ReactNode  // Always-visible actions
  collapsibleContent?: React.ReactNode // Expandable section
  
  // Render props alternative
  icon?: React.ReactNode
  instruction?: string  // Falls back if no children
}

// Usage: content = children ?? instruction
```

#### Hover-Reveal Pattern
```typescript
const [isHovering, setIsHovering] = React.useState(false)

<div
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
>
  {/* Always visible content */}
  {actions && isHovering && <div>{actions}</div>}
</div>
```

#### Tooltip Wrapping Pattern
```typescript
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

<TooltipProvider delayDuration={150}>
  <Tooltip>
    <TooltipTrigger asChild>
      <button>{content}</button>
    </TooltipTrigger>
    <TooltipContent>{tooltipText}</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 3. Storybook Guidelines (@autonoma/pond-ui only)

Create stories for all components in `packages/pond-ui`:

```typescript
// src/stories/ComponentName.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { ComponentName } from "../components/component-name"

const meta: Meta<typeof ComponentName> = {
  title: "ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered", // or "padded" for larger components
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["passed", "failed", "running", "pending"],
    },
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

// Default story
export const Default: Story = {
  args: {
    // default props
  },
}

// Status variants (if applicable)
export const Passed: Story = {
  args: { status: "passed" },
}

export const Failed: Story = {
  args: { status: "failed" },
}

export const Running: Story = {
  args: { status: "running" },
}

// With various slot combinations
export const WithActions: Story = {
  args: {
    actions: <button>Edit</button>,
  },
}
```

---

## 4. Common UI Patterns

### Card Containers
```tsx
<div className="rounded-lg border bg-white p-4 shadow-sm">
  {/* Card content */}
</div>

// With status
<div className={cn(
  "rounded-lg border px-2.5 py-2",
  status === "passed" && "bg-green-50 border-green-200",
  status === "failed" && "bg-red-50 border-red-200",
)}>
```

### List Items
```tsx
<div className="flex items-center gap-2 min-h-11 px-2.5">
  <div className="flex items-center gap-1.5 flex-1 min-w-0">
    {/* Icon + Text - truncate long text */}
    <span className="truncate">{text}</span>
  </div>
  <div className="flex items-center gap-1 flex-shrink-0">
    {/* Actions */}
  </div>
</div>
```

### Status Badges
```tsx
// Use the StatusBadge component from @autonoma/pond-ui
<StatusBadge status="passed" />
<StatusBadge status="failed" />
<StatusBadge status="running" />

// Or inline
<span className={cn(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
  status === "passed" && "bg-green-100 text-green-800",
  status === "failed" && "bg-red-100 text-red-800",
)}>
  {status === "passed" && <Check className="size-3" />}
  {label}
</span>
```

### Step Numbers
```tsx
<div className={cn(
  "text-xs font-medium rounded-full size-4 flex items-center justify-center",
  "bg-gray-100 text-gray-600", // default
  status === "passed" && "bg-green-100 text-green-800",
)}>
  {number}
</div>
```

### Loading States
```tsx
import { Loader2 } from "lucide-react"

// Inline spinner
<Loader2 className="size-4 animate-spin text-gray-500" />

// Button loading
<Button disabled>
  <Loader2 className="size-4 animate-spin mr-2" />
  Loading...
</Button>

// Skeleton
<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
```

---

## 5. Icons

Use **Lucide React** exclusively:

```typescript
import { 
  Check,           // Success states
  XCircle,         // Error states
  Loader2,         // Loading (with animate-spin)
  GripVertical,    // Drag handles
  Play,            // Run/start actions
  OctagonPause,    // Breakpoints/pause
  ChevronRight,    // Navigation, expansion
  MoreHorizontal,  // Overflow menus
} from "lucide-react"
```

### Icon Sizing Convention
```tsx
<Icon className="size-3" />    // 12px - Small inline
<Icon className="size-3.5" />  // 14px - Standard inline
<Icon className="size-4" />    // 16px - Buttons, prominent
<Icon className="size-5" />    // 20px - Headers, empty states
```

---

## 6. Accessibility

### Required Practices
- All interactive elements must be keyboard accessible
- Use semantic HTML (`button` for actions, not `div`)
- Include tooltips for icon-only buttons
- Maintain focus visibility
- Use `aria-label` for icon buttons without visible text

```tsx
// Good
<button
  type="button"
  onClick={handleClick}
  className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
  aria-label="Delete item"
>
  <Trash className="size-4" />
</button>

// With Tooltip (preferred)
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" onClick={handleClick}>
        <Trash className="size-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Delete item</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 7. Do's and Don'ts

### ✅ Do
- Use `cn()` for all className merging
- Export component types explicitly
- Use status-driven styling consistently
- Keep components focused (single responsibility)
- Use Tailwind utilities over custom CSS
- Follow the slot pattern for flexible composition
- Add JSDoc comments for complex props

### ❌ Don't
- Don't use inline styles
- Don't create one-off color values
- Don't skip loading/error states
- Don't use `any` types
- Don't mix styling approaches (stick to Tailwind)
- Don't forget hover states for interactive elements

---

## 8. Brand Guidelines Fallback

When product UI doesn't define something, reference brand guidelines:

| Element | Brand Value |
|---------|-------------|
| Company Name | "Autonoma" (lowercase in logo: "autonoma") |
| Tagline | "Keep calm and deploy. Even on Fridays." |
| Mascot | Quara (the frog) - use for empty states, errors, onboarding |
| Voice | Confident, warm, practical, never robotic |

### Mascot Usage (Quara)
- 404/error pages
- Empty states
- Onboarding flows
- Loading animations (when appropriate)

```tsx
// Example empty state
<div className="flex flex-col items-center justify-center py-12 text-center">
  <img src="/quara-sherlock.png" alt="" className="size-24 mb-4" />
  <h3 className="text-lg font-medium text-gray-900">No tests found</h3>
  <p className="text-sm text-gray-500 mt-1">
    Create your first test to get started
  </p>
</div>
```

---

## 9. CSS Variables Reference

From `styles.css`:

```css
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 222.2 84% 4.9%;      /* Near black */
  --primary: 222.2 47.4% 11.2%;      /* Dark blue */
  --primary-foreground: 210 40% 98%; /* Light */
  --muted: 210 40% 96.1%;            /* Light gray */
  --muted-foreground: 215.4 16.3% 46.9%; /* Medium gray */
  --border: 214.3 31.8% 91.4%;       /* Light border */
  --ring: 222.2 84% 4.9%;            /* Focus ring */
  --radius: 0.5rem;                  /* Default border radius */
}
```

Use via Tailwind: `bg-background`, `text-foreground`, `border-border`, etc.

---

## 10. Checklist for New Components

When creating a new component in @autonoma/pond-ui:

- [ ] Place in correct directory (`components/` or `components/ui/`)
- [ ] Export types explicitly
- [ ] Use CVA for variant styling (if needed)
- [ ] Use `cn()` for className composition
- [ ] Follow slot pattern for flexible content areas
- [ ] Add hover states for interactive elements
- [ ] Include loading state handling
- [ ] Add Storybook stories with all variants
- [ ] Use Lucide icons consistently
- [ ] Include tooltip for icon-only buttons
- [ ] Test keyboard accessibility
- [ ] Export from `src/index.ts`
