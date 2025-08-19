import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;
          google_business_url: string | null;
          subscription_status: string;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          company_name?: string | null;
          google_business_url?: string | null;
          subscription_status?: string;
          trial_ends_at?: string | null;
        };
        Update: {
          company_name?: string | null;
          google_business_url?: string | null;
          subscription_status?: string;
          trial_ends_at?: string | null;
        };
      };
      qr_codes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          google_business_url: string;
          short_code: string;
          scan_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          google_business_url: string;
          short_code: string;
        };
        Update: {
          title?: string;
          google_business_url?: string;
        };
      };
    };
  };
};