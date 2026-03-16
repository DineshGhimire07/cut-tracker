import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables!");
  // Insert a visible error into the DOM so the user isn't stuck with a blank screen on Vercel
  if (typeof window !== 'undefined') {
    document.body.innerHTML = `
      <div style="color: white; padding: 2rem; font-family: sans-serif; text-align: center; margin-top: 10vh;">
        <h1 style="color: #ef4444;">Deploy Error: Missing Environment Variables</h1>
        <p>Your Supabase keys are not set up in Vercel. You must add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> to your Vercel project settings, and then trigger a Redeploy.</p>
      </div>
    `;
  }
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
