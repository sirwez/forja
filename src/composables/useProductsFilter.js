import { computed, reactive } from 'vue'

export function useProductsFilter(products) {
  const filters = reactive({
    search: '', category: 'all', type: 'all', tag: 'all', rarity: 'all', maxPrice: '', sort: 'featured'
  })

  const tagOptions = computed(() => {
    const set = new Set()
    products.value.forEach((product) => (product.tags || []).forEach((tag) => set.add(tag)))
    return Array.from(set)
  })

  const filtered = computed(() => {
    const term = filters.search.trim().toLowerCase()
    let list = products.value.filter((product) => {
      const text = [product.name, product.short_description, product.description, product.category?.name, product.rarity, ...(product.tags || [])].join(' ').toLowerCase()
      const bySearch = !term || text.includes(term)
      const byCategory = filters.category === 'all' || product.category_id === filters.category || product.category?.slug === filters.category
      const byRarity = filters.rarity === 'all' || product.rarity === filters.rarity
      const byTag = filters.tag === 'all' || (product.tags || []).includes(filters.tag)
      const max = Number(filters.maxPrice || 0)
      const byPrice = !max || !product.price || Number(product.price) <= max
      const byType = filters.type === 'all'
        || (filters.type === 'shopee' && product.shopee_url)
        || (filters.type === 'custom' && product.is_customizable)
        || (filters.type === 'order' && product.is_made_to_order)
        || (filters.type === 'stock' && Number(product.stock || 0) > 0)
      return bySearch && byCategory && byRarity && byTag && byPrice && byType
    })

    list = [...list].sort((a, b) => {
      if (filters.sort === 'recent') return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      if (filters.sort === 'price-asc') return Number(a.price || 999999) - Number(b.price || 999999)
      if (filters.sort === 'price-desc') return Number(b.price || 0) - Number(a.price || 0)
      return Number(b.is_featured) - Number(a.is_featured) || Number(a.featured_rank || 0) - Number(b.featured_rank || 0)
    })
    return list
  })

  function resetFilters() {
    Object.assign(filters, { search: '', category: 'all', type: 'all', tag: 'all', rarity: 'all', maxPrice: '', sort: 'featured' })
  }

  return { filters, filtered, tagOptions, resetFilters }
}
