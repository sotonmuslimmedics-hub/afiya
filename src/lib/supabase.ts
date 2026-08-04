import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fails loudly at boot rather than silently breaking every request —
  // easy to miss a missing Netlify env var otherwise.
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in your .env (local) or Netlify site settings (deployed).'
  );
}

export const supabase = createClient(url, anonKey);
