const SUPABASE_URL = "https://dnozowivbyodvvonxybu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dEGMCcj1lfz576KrI14UYg_4JfAeMYG";
const WHATSAPP_NUMBER = "558688843379";
function supabaseReady() {
  return (
    window.supabase &&
    SUPABASE_URL &&
    !SUPABASE_URL.includes("COLE_AQUI") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("COLE_AQUI")
  );
}
const db = supabaseReady()
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
