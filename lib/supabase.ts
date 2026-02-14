import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SQL Schema Reference for Supabase:
 * 
 * -- Table for storing weekly schedules
 * create table schedules (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id text not null, 
 *   data jsonb not null,
 *   updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id)
 * );
 * 
 * -- Table for storing daily reflections and analysis
 * create table daily_entries (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id text not null,
 *   date text not null, 
 *   reflection text,
 *   analysis jsonb,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   unique(user_id, date)
 * );
 */
