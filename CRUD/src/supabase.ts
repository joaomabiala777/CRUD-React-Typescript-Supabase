import { createClient } from "@supabase/supabase-js";

// Verifique se os nomes batem exatamente com o seu .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 

export const supabase = createClient(supabaseUrl, supabaseKey);
