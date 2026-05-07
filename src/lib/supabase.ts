import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const env = meta.env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ckkjvhybrjvqlwviwoyx.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNra2p2aHlicmp2cWx3dml3b3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzM3NTgsImV4cCI6MjA5Mzc0OTc1OH0.TJKURWyrH8Z_AVMg2T5_MInxIW_KIRHeJLvyaRbWMAw';

// Provide a fallback to avoid "supabaseKey is required" crash at startup
if (!supabaseAnonKey) {
  console.warn('SUPABASE WARNING: VITE_SUPABASE_ANON_KEY is missing.');
}

// Ensure we always pass a string that looks like a URL to the constructor
const finalUrl = typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://ckkjvhybrjvqlwviwoyx.supabase.co';

export const supabase = createClient(
  finalUrl, 
  supabaseAnonKey
);

export type Profile = {
  id: string;
  email: string;
  name?: string;
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  goal: string;
  is_premium: boolean;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score?: number;
  completed_at?: string;
};
