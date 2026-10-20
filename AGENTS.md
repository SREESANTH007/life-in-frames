# Life in Frames — Agent & Development Guidelines

This document serves as the persistent rulebook and stack reference for AI coding agents and human contributors working on **Life in Frames**, based on the Product Requirements Document (`docs/PRD.md`).

---

## 1. Core Technology Stack

- **Frontend Framework**: Standard React web application built with **Vite** and **TypeScript** (`strict: true`).
- **Styling**: **Tailwind CSS** with centralized visual tokens (deep charcoal/near-black theme, muted purple accents, cinematic aesthetic).
- **Navigation**: **React Router** (declarative client-side routing with clean error boundaries).
- **Icons**: **Lucide React**.
- **Local Persistence (Future Phase)**: **IndexedDB** for offline-first local storage via repository abstraction.
- **Android Packaging (Future Phase)**: **Capacitor** packaging the production web build into an Android application (Google Play Store AAB).
- **Backend (Future Phase)**: Node.js, Express, TypeScript, REST API architecture.
- **Database (Future Phase)**: PostgreSQL with Prisma ORM.
- **Cloud Media (Future Phase)**: Cloudflare R2 private bucket with short-lived signed URLs.

### Explicit Architectural Exclusions
- ❌ **No Expo** or **React Native** (must remain a conventional responsive React web app packaged with Capacitor).
- ❌ **No Firebase** (custom backend + PostgreSQL + Prisma).
- ❌ **No AI APIs** (no OpenAI, Gemini, Claude, or AI-generated summaries in the app; all summaries and rewind features are deterministic calculations over stored user data).
- ❌ **No Public Social Feeds**, followers, likes, or public profile pages (strictly private personal archive).
- ❌ **No mandatory online connection** for core personal record creation.
- ❌ **No invasive permissions** or background telemetry.

---

## 2. Development Rules (from PRD Section 24 & Section 23)

1. **PRD as Source of Truth**: All architectures, fields, UX guidelines, and phases must align strictly with `docs/PRD.md`.
2. **Standard React + Vite + TypeScript**: Develop cleanly as a responsive web application runnable in any browser.
3. **No Expo or React Native**: Never install or scaffold React Native or Expo tooling.
4. **Responsive from Day One**: Mobile-first touch targets, bottom navigation bar on mobile, sidebar/expanded navigation on desktop, safe-area support for Android insets.
5. **No Firebase or AI Services**: Rely only on self-hosted backend, PostgreSQL, and deterministic logic.
6. **One Focused Change at a Time**: Break work into small, verifiable increments. Do not jump ahead into future phases.
7. **Inspect Before Editing**: Always read existing files and inspect dependencies and directories before proposing modifications.
8. **Reuse Established Components**: Maintain consistency across components, design tokens, buttons, inputs, modal dialogs, and cards.
9. **Do Not Overwrite Working Functionality**: Extend and refactor carefully; avoid regressions.
10. **Build and Lint After Every Change**: Run `npm run build` and `npm run lint` (or TypeScript compiler check) after every meaningful change. Zero unresolved errors.
11. **No Hardcoded Fake Data**: In accordance with Section 23 ("Definition of Done"), do not substitute hardcoded fake records for functioning features. Use genuine data structures, empty states, or local test stores.
12. **Transparent Progress Reporting**: Report changed files, what works, what is not yet implemented, and exact browser testing steps.
13. **Security by Design**: Never commit or expose API secrets, service keys, or tokens in frontend code.
14. **Clean Layer Separation**: Keep UI components, domain models, local persistence, sync queues, and backend API calls decoupled through clean abstractions.
15. **Capacitor Ready**: Never use browser-only globals without fallbacks or patterns that break inside an Android WebView.
