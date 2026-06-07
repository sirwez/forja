import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET = 'products'
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_BYTES = 6 * 1024 * 1024

export function validateImage(file) {
  if (!file) throw new Error('Selecione uma imagem.')
  if (!ALLOWED.includes(file.type)) throw new Error('Use imagens JPG, PNG ou WebP.')
  if (file.size > MAX_BYTES) throw new Error('A imagem deve ter até 6MB.')
}

export async function uploadProductImage(file, folder = 'products') {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para enviar imagens.')
  validateImage(file)
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function removeProductImage(publicUrl) {
  if (!isSupabaseConfigured || !publicUrl) return
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return
  const path = decodeURIComponent(publicUrl.slice(index + marker.length))
  await supabase.storage.from(BUCKET).remove([path])
}
