# Architectural Design

## Overview
The application utilizes a serverless architecture designed for real-time state management and secure data persistence. It relies on a React-based frontend interacting with a PostgreSQL database managed by Supabase.

## Component Stack

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | Handles client and server-side rendering, application routing, and secure API endpoints. |
| **UI/Styling** | Tailwind CSS + shadcn/ui | Manages component composition, responsive design, and implementation of the PUP maroon and gold branding. |
| **Backend & Database** | Supabase | Provides the PostgreSQL database, Row Level Security (RLS) for data privacy, and built-in user authentication. |
| **State Management** | React Context / Zustand | Facilitates the real-time calculation and synchronization of GWA across multiple term components. |
| **Export Utilities** | jsPDF, PapaParse | Executes client-side generation of PDF summaries and CSV exports without server overhead. |

## Database Schema
The database operates on a relational model utilizing three primary tables protected by Row Level Security (RLS).

* **Profiles:** Links to the authentication user ID, stores display names, and manages the boolean flag for public shareable links.
* **Terms:** Associated with a profile ID, stores the specific academic semesters dynamically created by the user.
* **Subjects:** Linked to a term ID, stores the course code, numeric units, and the grade (stored as text to accommodate numeric grades, "Inc", and "W").