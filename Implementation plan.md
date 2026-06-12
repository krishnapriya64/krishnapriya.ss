# Initialize Next.js Portfolio (Tailwind v4 Optimized)

This plan covers initializing a Next.js project with Tailwind CSS v4, integrating the provided `Portfolio` component, and verifying it runs locally.

## Proposed Changes

### 1. Setup and Dependencies
- Initialize a new Next.js app in the current empty workspace `d:\portfolio` using:
  `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
- Install necessary packages: `framer-motion` and `lucide-react`.

### 2. Update Global Styles (CSS-First Tailwind v4)
#### [MODIFY] `src/app/globals.css`
Next.js generates default boilerplate styles that conflict with the minimalist white design system. I will completely replace the contents of `src/app/globals.css` with Tailwind v4 imports, smooth scrolling, and custom theme overrides. This eliminates the need for any legacy `tailwind.config.ts` file:

```css
@import "tailwindcss";

/* Tailwind v4 CSS-First Theme Customizations */
@theme {
  --animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-spin-slow: spin 12s linear infinite;
}

/* Base resets & behavior */
html {
  scroll-behavior: smooth;
}
```

### 3. Create the Portfolio Component
#### [MODIFY] `src/app/page.tsx`
Replace the default Next.js homepage with the provided `Portfolio` component.
Ensure `"use client";` is declared at the top of the file to allow React hooks (`useState`, `useEffect`, `useRef`) and Framer Motion transitions.

## Verification Plan

### Automated Tests
Run `npm run build` to ensure the project compiles with zero TypeScript or Tailwind warnings.
