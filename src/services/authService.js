import { supabase, isSupabaseConfigured } from './supabase'

export async function signIn(email, password) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase antes de acessar o admin.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  const allowed = await isAdmin()
  if (!allowed) {
    await supabase.auth.signOut()
    throw new Error('Este usuário não está autorizado no Painel da Guilda.')
  }
  return data
}

export async function signOut() {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function isAdmin() {
  if (!isSupabaseConfigured) return false
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return Boolean(data)
}
