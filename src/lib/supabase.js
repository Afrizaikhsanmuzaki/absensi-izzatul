import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ffhnxfsetlqftfcyvjfc.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_W0Zob25U9llJ7K-DeO1YtLA_CdJc1XoG";

export const supabase = createClient(supabaseUrl, supabaseKey);