# Implementation Plan: PUPSIS GWA Calculator

This document outlines the roadmap for building the PUPSIS GWA Calculator. It is divided into 5 major phases, ensuring a structured approach from foundational setup to final polish.

## Phase 1: Foundation, Database & Authentication
**Goal:** Establish the project foundation, configure the database schema, and implement secure user authentication.

- [ ] **Task 1.1:** Initialize the Next.js (App Router) project with Tailwind CSS and TypeScript.
- [ ] **Task 1.2:** Integrate `shadcn/ui` and configure the PUP branding theme (Maroon and Gold colors).
- [ ] **Task 1.3:** Set up the Supabase project and install `@supabase/ssr`.
- [ ] **Task 1.4:** Execute the Supabase SQL schema to create the `profiles`, `terms`, and `subjects` tables with `ON DELETE CASCADE`.
- [ ] **Task 1.5:** Implement Row Level Security (RLS) policies enforcing private access by default and public access based on the `is_public` flag.
- [ ] **Task 1.6:** Build the authentication flow (Login/Signup pages) handling cookie-based sessions across Client and Server Components.

## Phase 2: Core Logic & State Management
**Goal:** Implement the mathematical engine that enforces PUP grading rules and setup global state.

- [ ] **Task 2.1:** Create the `calculateGwa.ts` utility function to handle the math logic (ignoring "Inc" and "W" grades).
- [ ] **Task 2.2:** Implement the Latin Honors evaluation logic, including disqualification triggers (grades < 2.5, "Inc", "W", 5.0).
- [ ] **Task 2.3:** Set up Zustand or React Context for managing local optimistic updates of terms and subjects before saving to the database.
- [ ] **Task 2.4:** Write unit tests or perform strict manual validation for the core grading and honor evaluation logic to guarantee accuracy.

## Phase 3: Backend Integration (Server Components & Actions)
**Goal:** Connect the Next.js frontend to the Supabase database using the App Router paradigm.

- [x] **Task 3.1:** Create Next.js Server Components to securely fetch the user's `profiles`, `terms`, and `subjects` directly from the database.
- [x] **Task 3.2:** Implement Next.js Server Actions for data mutation (adding/editing/deleting a term).
- [x] **Task 3.3:** Implement Next.js Server Actions for subjects (adding/editing/deleting a subject within a term).
- [x] **Task 3.4:** Implement Server Actions for toggling the `is_public` profile visibility flag.

## Phase 4: UI Implementation & User Experience
**Goal:** Build out the interactive, responsive user interface.

- [ ] **Task 4.1:** Build the Dashboard layout, including navigation and the overall GWA & Latin Honors summary card.
- [ ] **Task 4.2:** Develop the `TermCard.tsx` component to display individual semesters and their specific term GWA.
- [ ] **Task 4.3:** Develop the `SubjectRow.tsx` component with form inputs/selects for adding grades and units.
- [ ] **Task 4.4:** Implement loading skeletons and error boundaries for Server Components to enhance perceived performance.
- [ ] **Task 4.5:** Build the public shareable profile view for users with `is_public` set to true.

## Phase 5: Export Utilities & Final Polish
**Goal:** Finalize the application with export features and ensure everything is production-ready.

- [ ] **Task 5.1:** Integrate `jsPDF` and build a utility to export the user's grading summary as a formatted PDF.
- [ ] **Task 5.2:** Integrate `PapaParse` and build a utility to export the grading data as a CSV file.
- [ ] **Task 5.3:** Perform a full end-to-end review of RLS policies and Next.js SSR auth checks.
- [ ] **Task 5.4:** Verify responsive design across mobile, tablet, and desktop views.
- [ ] **Task 5.5:** Deploy the application.
