const SUPABASE_URL = 'COLE_AQUI_A_PROJECT_URL';
const SUPABASE_ANON_KEY = 'COLE_AQUI_A_ANON_PUBLIC_KEY';
const WHATSAPP_NUMBER = '558688843379';
function supabaseReady(){return window.supabase && SUPABASE_URL && !SUPABASE_URL.includes('COLE_AQUI') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('COLE_AQUI')}
const db = supabaseReady() ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
