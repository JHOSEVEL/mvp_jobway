
import { createClient } from '@supabase/supabase-js';

// Fallbacks para garantir que o cliente seja criado sem travar a aplicação no load
// Fixed: Using process.env directly instead of window.process
const supabaseUrl = process.env.SUPABASE_URL || 'https://znewstmnzodkwitcmxoi.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_B1FgHEDYeco7TyMIfP-OPw_f1XB5YKQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
