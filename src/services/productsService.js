import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackProducts } from './sampleData'

const withCategory = '*, category:categories(*)'

const productColumns = [
  'name',
  'slug',
  'short_description',
  'description',
  'category_id',
  'price',
  'image_url',
  'gallery',
  'shopee_url',
  'whatsapp_message',
  'is_active',
  'is_featured',
  'is_legendary',
  'is_customizable',
  'is_made_to_order',
  'has_shopee',
  'stock',
  'tags',
  'rarity',
  'item_type',
  'material',
  'delivery_note',
  'featured_rank',
]

function normalize(product) {
  return {
    ...product,
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    category: product.category || product.categories || null,
    has_shopee: Boolean(product.shopee_url || product.has_shopee),
  }
}

function pickProductPayload(payload) {
  const clean = {}

  for (const column of productColumns) {
    if (Object.prototype.hasOwnProperty.call(payload, column)) {
      clean[column] = payload[column]
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'shopee_url')) {
    clean.has_shopee = Boolean(clean.shopee_url)
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'price')) {
    clean.price = clean.price === '' || clean.price === null || Number.isNaN(Number(clean.price)) ? null : Number(clean.price)
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'stock')) {
    clean.stock = clean.stock === '' || clean.stock === null || Number.isNaN(Number(clean.stock)) ? 0 : Number(clean.stock)
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'featured_rank')) {
    clean.featured_rank = clean.featured_rank === '' || clean.featured_rank === null || Number.isNaN(Number(clean.featured_rank)) ? 0 : Number(clean.featured_rank)
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'gallery')) {
    clean.gallery = Array.isArray(clean.gallery) ? clean.gallery : []
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'tags')) {
    clean.tags = Array.isArray(clean.tags) ? clean.tags : []
  }
  if (Object.prototype.hasOwnProperty.call(clean, 'category_id')) {
    clean.category_id = clean.category_id || null
  }

  return clean
}

export async function listPublicProducts() {
  if (!isSupabaseConfigured) return fallbackProducts
  const { data, error } = await supabase
    .from('products')
    .select(withCategory)
    .eq('is_active', true)
    .order('featured_rank', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalize)
}

export async function listAdminProducts() {
  if (!isSupabaseConfigured) return fallbackProducts
  const { data, error } = await supabase
    .from('products')
    .select(withCategory)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalize)
}

export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured) return fallbackProducts.find((p) => p.slug === slug) || null
  const { data, error } = await supabase
    .from('products')
    .select(withCategory)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data ? normalize(data) : null
}

export async function saveProduct(payload, id = null) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para salvar produtos.')

  const clean = pickProductPayload(payload)
  const query = id
    ? supabase.from('products').update(clean).eq('id', id).select(withCategory).single()
    : supabase.from('products').insert(clean).select(withCategory).single()

  const { data, error } = await query
  if (error) throw error
  return normalize(data)
}

export async function deleteProduct(id) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para excluir produtos.')
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function duplicateProduct(product) {
  const payload = pickProductPayload({
    ...product,
    name: `${product.name} (cópia)`,
    slug: `${product.slug}-copia-${Date.now().toString().slice(-4)}`,
  })
  return saveProduct(payload)
}

export async function quickUpdateProduct(id, patch) {
  if (!isSupabaseConfigured) throw new Error('Configure o Supabase para atualizar produtos.')
  const clean = pickProductPayload(patch)
  const { data, error } = await supabase
    .from('products')
    .update(clean)
    .eq('id', id)
    .select(withCategory)
    .single()
  if (error) throw error
  return normalize(data)
}
