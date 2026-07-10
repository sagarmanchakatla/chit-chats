-- Love Chits Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles table (only one row ever)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Love Chits table
CREATE TABLE IF NOT EXISTS love_chits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT '#F472B6',
  illustration TEXT,
  redeemed BOOLEAN DEFAULT false NOT NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_chits ENABLE ROW LEVEL SECURITY;

-- Profiles: only authenticated user can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Love Chits: only authenticated user can read all chits
CREATE POLICY "Authenticated users can view chits"
  ON love_chits FOR SELECT
  USING (auth.role() = 'authenticated');

-- Love Chits: only authenticated user can update chits (for redemption)
CREATE POLICY "Authenticated users can update chits"
  ON love_chits FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Love Chits: only authenticated user can insert chits (for seeding)
CREATE POLICY "Authenticated users can insert chits"
  ON love_chits FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create a trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
