/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://mowzlivjidwslafqxapb.supabase.co';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8B0FcjvuyfV78NGF6cHEgQ_mX94QLhTame';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Debug connection to database (testing connection only)
const testConnection = async () => {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) console.warn("Supabase database connection warning:", error.message);
    else console.log("Supabase database connected successfully");
  } catch (err) {
    console.warn("Supabase database test failed:", err);
  }
};
testConnection();
