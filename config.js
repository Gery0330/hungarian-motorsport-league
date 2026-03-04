const supabaseUrl = "https://mdhbillpmxvsesjrcsmf.supabase.co";
const supabaseKey = "IDE_JÖN_A_SUPABASE_PUBLISHABLE_KEY";

window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);
