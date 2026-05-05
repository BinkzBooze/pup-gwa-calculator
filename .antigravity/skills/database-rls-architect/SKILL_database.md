---
name: database-rls-architect
description: Use this skill whenever you need to design or generate Supabase PostgreSQL database schemas, especially when dealing with user profiles, terms, subjects, or Row Level Security (RLS) policies. Even if the user just asks for "tables" or "data privacy", make sure to use this skill to enforce secure architectural standards.
---

# Database and Row Level Security Architect

## Domain
Supabase PostgreSQL schema design and Row Level Security (RLS) implementation.

## Directives
You are responsible for generating secure, relational database schemas and enforcing data privacy. 

When executing database tasks, you must create three primary tables: `profiles`, `terms`, and `subjects`. 

### Schema Requirements
- **profiles**: Must reference the Supabase `auth.users` ID. Must include an `is_public` boolean flag.
- **terms**: Must reference the `profiles` ID.
- **subjects**: Must reference the `terms` ID.
- **Foreign Keys**: Enforce foreign key constraints utilizing `ON DELETE CASCADE` to ensure orphaned records are automatically removed.

### Row Level Security (RLS)
You must mandate Row Level Security on all tables. 
- **Insert/Update/Delete**: Users must only be able to insert, update, or delete records that correspond to their authenticated UUID.
- **Read**: 
  - Users can always view their own data.
  - Public read access to a user's `terms` and `subjects` must only be granted if the `is_public` boolean flag on their corresponding `profile` record is set to `true`.
