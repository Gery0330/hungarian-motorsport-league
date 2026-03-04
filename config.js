const supabaseUrl = "https://mdhbillpmxvsesjrcsmf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kaGJpbGxwbXh2c2VzanJjc21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzE1OTAsImV4cCI6MjA4NzEwNzU5MH0.QGQ_AnbXN0fzNKdalQMdy4Cw1tmWU_gB0-usqeFxil0";

window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);
