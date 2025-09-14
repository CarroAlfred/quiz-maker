# QUIZ MAKER App Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Folder Structure](#architecture--folder-structure)
3. [Tech Stack & Decisions](#tech-stack--decisions)
4. [Setup & Installation](#setup--installation)
5. [Core Features](#core-features)
6. [Hooks](#hooks)
7. [Components](#components)
8. [Anti-Cheat Logging](#anti-cheat-logging)
9. [Error Handling](#error-handling)
10. [State Management](#state-management)
11. [Testing](#testing)
12. [Linting & Formatting](#linting--formatting)
13. [Build & Production](#build--production)

---

## Project Overview

**QUIZ MAKER App** is a **React + TypeScript** project for creating and taking quizzes. It uses **feature-based architecture**, **React Hook Form**, and **TanStack Query** for form management and API data fetching. TailwindCSS is used for styling.

The app also implements a lightweight anti-cheat system for quizzes by logging user interactions like copy, paste, tab switches, and exit attempts.

---

## Architecture & Folder Structure

The app is **feature-based** with clear separation of concerns:

```
src/
├─ api/                     # API service layer
│  ├─ services/             # Axios wrapper
│  ├─ quizzes/              # Quiz API endpoints
│  └─ questions/            # Question API endpoints
├─ components/              # Reusable “dumb” components
│  ├─ common/               # Buttons, Typography, TextArea, Card, Loaders
│  ├─ ErrorBoundary/        # Error Boundary fallback
│  └─ layout/               # main layout (Dashboard, e.g headers if needed)
├─ hooks/                   # Custom hooks for queries & mutations
│  ├─ queries/              # hook for getters (quiz/player)
│  └─ mutations/            # hook for updates/create/delete
├─ pages/                   # Feature-level “smart” components
│  ├─ Player/               # Quiz taking pages (PlayerPage, PlayerScore)
│  └─ Quiz/                 # Quiz management pages (Create/Update)
├─ presentation/            # Builts the UI for the pages (forms, effects)
│  ├─ player/
│  └─ quiz/
├─ routes/                  # App routing
│  └─ AppRouter.tsx
├─ setupTests.ts            # Vitest setup
├─ types/                   # TypeScript interfaces & enums
└─ utils/                   # Helpers, test wrappers, formatters
└─ styles/                  # Global and variables
```

**Trade-offs & Decisions:**

- **React Hook Form + TanStack Query**
  - Pros: Clean separation between form state and API state, minimal re-renders.
  - Cons: Slight learning curve; controlled vs uncontrolled field management.

- **Feature-based folder structure**
  - Pros: Easier scaling, clear separation of concerns.
  - Cons: More nested folders; requires good conventions.

- **TailwindCSS**
  - Pros: Rapid UI development, highly composable.
  - Cons: Verbose class names; design consistency relies on developer discipline.

- **Component Reuse**
  - `components/common` → dumb, reusable UI components (Card, Button, Typography)
  - `pages/*` → smart components integrating forms, hooks, and logic

---

## Tech Stack & Decisions

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** TailwindCSS
- **Data Fetching:** TanStack React Query
- **API Client:** Axios
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Icons:** React Icons

---

## Setup & Installation

1. Clone the repository:

```bash
git clone git@github.com:CarroAlfred/quiz-maker-app.git
cd quiz-maker-app
```

or via HTTP:

```bash
git clone https://github.com/CarroAlfred/quiz-maker-app.git
cd quiz-maker-app
```

2. Install dependencies:

```bash
yarn install
```

3. Add environment variables:

### Note: Before running add the env first or restart your local in order to take effect

```env
VITE_API_BASE_URL=http://yourapiurl
VITE_BEARER_TOKEN=yourtoken

```

4. Start development server:

```bash
yarn dev
```

5. Build for production:

```bash
yarn build
```

---

## Core Features

- **Quiz Management:** Create, update, and reorder questions.
- **Quiz Taking:** Answer MCQs, short-answer, and code questions.
- **Player UI:** Tracks score, auto-gradable questions, and violations.
- **Anti-Cheat:** Monitors copy/paste, tab switches, and exit attempts.
- **Skeleton Loading:** For API fetches in dropdowns or question lists.
- **Error Boundaries:** Prevents app crashes on rendering errors.

---

## Hooks

### Quiz Hooks

- `useStartQuiz` → Initiates a quiz attempt.
- `useSaveAnswer` → Saves a user answer for a question.
- `useSubmitAttempt` → Submits the quiz attempt; handles success and error states.
- `useQuizProctor` → Tracks copy/paste/tab/exit violations.

### Common Hooks

- `useGetQuiz` → Fetch quiz details.
- `useGetQuizList` -> Fetch quiz list.

---

## Components

### Common / Reusable Components

- **Card** → Flexible card container with hover effect.
- **Button** → Variant-based button.
- **Typography** → Consistent text elements.
- **TextArea** → Input with validation and error messages.
- **SkeletonList** → Animated placeholder for loading states.
- **CircularLoader** → Inline or overlay spinner.

---

## Anti-Cheat Logging

- Implemented in **PlayerPage** via `useQuizProctor` hook.
- Tracks:

| Action       | Logged Data |
| ------------ | ----------- |
| Copy         | timestamp   |
| Paste        | timestamp   |
| Tab switch   | timestamp   |
| Exit attempt | timestamp   |

- Displayed in `PlayerScore` component after quiz submission.

---

## Error Handling

- **Axios interceptors** for global API errors.
- React Query retries once on failure.
- `onError` hooks handle per-request notifications.
- **UI Feedback:** Toast messages via `showToast`.

---

## State Management

- **Local state** → `useState` for form control and current step.
- **Form state** → `react-hook-form` for validation and control.
- **Server state** → React Query caches API responses, invalidates on mutation.
- **Derived state** → Memoized counts of violations, filtered questions, etc.

---

## Linting & Formatting

- ESLint + Prettier enforced with Husky + lint-staged.
- Commands:

```bash
yarn lint
yarn lint:fix
yarn format
yarn check-format
```

---

## Build & Production

- Vite builds production output in `dist/`.
- All reusable components are in `components/common/`.
- Pages integrate smart components with hooks.
- TailwindCSS ensures consistent UI.

---
