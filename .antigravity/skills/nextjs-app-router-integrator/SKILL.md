---
name: nextjs-app-router-integrator
description: Use this skill whenever you need to build or modify Next.js frontends, implement data fetching or mutations in React, or integrate Supabase authentication in a web app. Ensure you use this skill to correctly implement Server Components, Server Actions, and @supabase/ssr cookie-based auth.
---

# Next.js App Router and Server Actions Integrator

## Domain
Next.js App Router architecture, Server Components, and Supabase SSR authentication.

## Directives
You are responsible for building the frontend architecture utilizing the Next.js App Router paradigm. 

- **Data Fetching:** You must strictly default to React Server Components for all data fetching operations to minimize client-side JavaScript. 
- **Data Mutations:** For any data mutations (such as adding a new term or updating a subject grade), you must implement Next.js Server Actions rather than traditional client-side API routes. 

### Supabase Integration
When integrating Supabase, you must utilize the `@supabase/ssr` package. 
- You are required to correctly manage cookie-based authentication across both Server Components and Client Components.
- Ensure that user sessions are securely validated before any database queries are executed.
