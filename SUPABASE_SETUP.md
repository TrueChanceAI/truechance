# Supabase Setup Guide

## Environment Variables

To use the profile functionality, you need to set up the following environment variables in your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### Option 1: UUID-based Schema (Recommended)

```sql
create table public.users (
  id uuid not null default extensions.uuid_generate_v4(),
  email text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
);
```

### Option 2: Text-based Schema (Alternative)

If you encounter UUID conversion issues, you can use a text-based ID:

```sql
create table public.users (
  id text not null,
  email text not null,
  first_name text not null,
  last_name text not null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email)
);
```

## Row Level Security (RLS)

You may want to enable RLS policies for the users table. Here's a basic policy example:

```sql
-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read and update their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id OR auth.uid() = id::uuid);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id OR auth.uid() = id::uuid);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = id OR auth.uid() = id::uuid);
```

## Getting Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Add them to your `.env.local` file

## Troubleshooting

### UUID Conversion Issues

If you encounter UUID conversion errors, the system automatically converts Kinde IDs (e.g., `kp_6d7982c0e6cf4b5ea88299d10fb692cb`) to UUID format (e.g., `6d7982c0-e6cf-4b5e-a882-99d10fb692cb`).

### Testing UUID Conversion

Visit `/test-uuid` to test the UUID conversion function with your Kinde ID.

### Common Issues

1. **Invalid UUID format**: Ensure your database table uses the correct UUID type
2. **RLS policies**: Make sure RLS policies allow the current user to access their profile
3. **Environment variables**: Verify that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
