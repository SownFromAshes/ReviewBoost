import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://poysowfpgymbfhuavhqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBveXNvd2ZwZ3ltYmZodWF2aHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NDMwNjgsImV4cCI6MjA3MTIxOTA2OH0.NlTrwR12FQ2etthlRztTLe13rLfq2GTL64vaOXyOybs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'sownfromashes@gmail.com',
    password: '181251'
  });

  if (error) {
    console.error('Login error:', error);
    return;
  }

  const token = data.session?.access_token;
  console.log('User access token:', token);
}

main();
