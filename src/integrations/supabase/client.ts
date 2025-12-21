import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://weuyqamrxelvlcyzubcn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndldXlxYW1yeGVsdmxjeXp1YmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMzAzOTAsImV4cCI6MjA4MTgwNjM5MH0.OyDJuH-83ENznrIqzwv5zkX9eDa1cRYYW2dI4L2m_Qg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
