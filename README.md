# QUIZ MAKER App Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Core Features](#core-features)
6. [Hooks](#hooks)
7. [Components](#components)
8. [Error Handling](#error-handling)
9. [State Management](#state-management)
10. [Testing](#testing)
11. [Linting & Formatting](#linting--formatting)
12. [Build & Production](#build--production)

---

## Project Overview

**QUIZ MAKER App** is a React + TypeScript project that allows users to select a country and corresponding state/region. It uses **React Query** for data fetching, **Axios** for API requests, and provides a **dropdown** components.

The project is built with Vite and SWC for fast development and optimized builds.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Data Fetching:** TanStack React Query
- **API Client:** Axios
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged
- **Icons:** React Icons

---

## Project Structure

```
src/
├─ api/                 # API service layer
│  ├─ services/         # Axios wrapper
│  ├─ countries/        # Country API services
│  └─ states/           # State API services
├─ components/          # Reusable components
│  ├─ Dropdown/
│  ├─ Autocomplete/
│  └─ loaders/          # Skeleton loaders
├─ hooks/               # Custom React hooks (queries and Mutations)
│  ├─ useGetCountries.ts
│  ├─ useGetStatesDetails.ts
│  └─ useCreateCountry.ts
├─ pages/               # Page-level components
│  └─ CountryPage.tsx
├─ routes/
│  └─ AppRouter.tsx
├─ setupTests.ts        # Vitest setup
└─ types/
│  └─ country.ts
|  └─ state.ts
└─ utils/
│  └─ test-wrapper.tsx
└─ styles/
   └─ globals.css
   └─ variables.css
```

---

## Setup & Installation

1. Clone the repository:

\*_via ssh_

```bash
git clone git@github.com:CarroAlfred/quiz-maker-app.git
cd quiz-maker-app

```

or

\*_via http_

```bash
git clone https://github.com/CarroAlfred/quiz-maker-app.git
cd quiz-maker-app
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Build for production:

```bash
yarn build
```

## Environment Variables

### NOTE: ADD THE .ENV VARIABLES FIRST BEFORE RUNNING IN YOUR LOCAL

```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_API_KEY=x-api-key (sample)
```

- `VITE_API_BASE_URL`: Base URL for your backend API.
- `VITE_API_KEY`: X-API-KEY for you backend headers.

---

---

## Core Features

- **Country Dropdown:** Select a country from the API list.
- **State Dropdown/Autocomplete:** Dynamically fetches states based on the selected country.
- **Skeleton Loading:** Shows loading placeholders for dropdown lists.
- **Error Boundaries:** Wraps the app to catch rendering errors.
- **Reactive State Reset:** Changing a country clears the selected state.

---

## Hooks

### `useGetCountries`

Fetches the country list using React Query:

```ts
const { data: countries, isLoading } = useGetCountries();
```

### `useGetStatesDetails`

Fetches states for a selected country:

```ts
const { data: states, isLoading: statesLoading } = useGetStatesDetails({ id: selectedCountryId });
```

### `useCreateCountry`

Mutation hook for creating a new country: **no api connection yet guide only**

```ts
const { handleCreateCountry } = useCreateCountry({
  onSuccess: () => console.log('Created'),
  onError: (err) => console.error(err),
});
```

---

## Components

### Dropdown

- Generic, reusable component with `isLoading` support.
- Accepts `items`, `value`, `onChange`, and `placeholder`.

### Autocomplete

- Filters items based on user input.
- Integrates with `SkeletonList` for loading states.
- Tracks `selectedItem` for controlled input behavior.

### SkeletonList

- Displays placeholder skeletons for loading data.
- Customizable item count:

```tsx
<SkeletonList count={5} />
```

---

## Error Handling

- Uses **ErrorBoundary** component:

```tsx
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <AppRouter />
</ErrorBoundary>
```

- React Query retries failed requests once by default.

---

## State Management

- Local `useState` for `selectedCountryId` and `selectedState`.
- React Query caches data and invalidates queries on mutation success.
- Autocomplete and dropdown components reset state appropriately when a higher-level selection changes.

---

## Testing

- **Vitest** + **Testing Library** used for unit and integration tests.
- Sample test for clearing state on country change:

```ts
fireEvent.click(screen.getByText('Select a country'));
fireEvent.click(screen.getByText('Philippines'));
fireEvent.click(screen.getByText('Search a state'));
fireEvent.click(screen.getByText('Manila'));
expect(screen.getByText('Select a state')).toBeInTheDocument();
```

- API hooks are mocked using `vi.fn()`.

---

## Linting & Formatting

- ESLint + Prettier setup.
- Husky + lint-staged enforce linting and formatting on commit.
- Run manually:

```bash
yarn lint
yarn lint:fix
yarn format
yarn check-format
```

---

## Build & Production

- Vite handles production builds:

```bash
yarn build
```

- Output located in `dist/`.
- Includes hashed CSS and JS for caching.
