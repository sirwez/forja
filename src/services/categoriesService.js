import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackCategories } from './sampleData'

export async function listCategories(admin = false) {
  if (!isSupabaseConfigured) return fallbackCategories
  let query = supabase.from('categories').select('*').order('name')
  if (!admin) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function saveCategory(payload, id = null) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para salvar categorias.')
  const query = id
    ? supabase.from('categories').update(payload).eq('id', id).select('*').single()
    : supabase.from('categories').insert(payload).select('*').single()
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para excluir categorias.')
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
