# SOP 01: Project Initialization, Database Architecture, and Authentication

## Agent Designation
**Role:** Lead Architect & Database Specialist
**Model:** Gemini 3.1 Pro
**Context Files to Read Before Execution:** `docs/PRD.md`, `docs/ARCHITECTURE.md`

## Mission Objective
Your task is to establish the foundational architecture for the PUPSIS Grades Calculator. You are responsible for initializing the Supabase backend, implementing the relational database schema, enforcing data privacy through Row Level Security (RLS), and setting up the authentication client in Next.js.

## Execution Steps

### Step 1: Client Setup and Environment
1. Ensure the Next.js project is properly initialized.
2. Install the necessary Supabase client libraries for SSR (Server-Side Rendering) in Next.js (`@supabase/supabase-js`, `@supabase/ssr`).
3. Create the foundational Supabase utility files (e.g., `lib/supabase/client.ts` and `lib/supabase/server.ts`) to handle authentication across client and server components.

### Step 2: Database Schema Execution
Generate the SQL script to create the following tables in the Supabase PostgreSQL database. Ensure foreign key constraints are strictly enforced with `ON DELETE CASCADE`.

* **`profiles`**: `id` (UUID, references auth.users), `display_name` (TEXT), `is_public` (BOOLEAN, default false).
* **`terms`**: `id` (UUID), `user_id` (UUID, references profiles), `title` (TEXT), `created_at` (TIMESTAMP).
* **`subjects`**: `id` (UUID), `term_id` (UUID, references terms), `code` (TEXT), `units` (NUMERIC), `grade` (TEXT).

### Step 3: Row Level Security (RLS) Implementation
This is the most critical security step. You must write and apply the SQL policies to ensure data is private by default, but shareable via the `is_public` flag.

1.  **Enable RLS** on `profiles`, `terms`, and `subjects` tables.
2.  **Profiles Policies:**
    * Users can insert their own profile upon signup.
    * Users can view and update their own profile.
    * Public can view a profile ONLY IF `is_public = true`.
3.  **Terms Policies:**
    * Users can perform all CRUD operations on their own terms (where `user_id = auth.uid()`).
    * Public can view terms ONLY IF the associated profile has `is_public = true`.
4.  **Subjects Policies:**
    * Users can perform all CRUD operations on their own subjects (where the linked `term_id` belongs to `auth.uid()`).
    * Public can view subjects ONLY IF the associated term belongs to a profile where `is_public = true`.

### Step 4: Verification and Handoff
1. Write a brief summary of the executed SQL commands and the files created.
2. Create a placeholder authentication route or component to verify that the Supabase client is correctly instantiated.
3. Once completed, output a status message confirming that the database layer is ready for the Core Logic Agent to begin work on the GWA calculation utilities.