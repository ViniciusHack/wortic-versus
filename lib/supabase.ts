import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client with your project URL and anon key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
)

