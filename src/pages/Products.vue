<template>
  <PublicLayout>
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumb"><RouterLink to="/">Forja</RouterLink> / Catálogo</div>
        <div class="section-head"><div><div class="eyebrow">Catálogo completo</div><h1>Inventário da Forja</h1><p class="lead">Filtre por coleção, raridade, preço e disponibilidade. No mobile, os filtros viram painel para compra rápida.</p></div><a class="btn btn-ember" :href="whatsGeneral" target="_blank">Forjar pedido</a></div>
      </div>
    </section>
    <section class="section compact">
      <div class="container store-layout">
        <button class="btn btn-ghost filter-toggle" @click="drawer = true">Abrir filtros</button>
        <ProductFilters :filters="filters" :categories="categories" :tags="tagOptions" :open="drawer" closable @reset="resetFilters" @close="drawer = false" />
        <div>
          <div class="toolbar">
            <input v-model="filters.search" class="field" placeholder="Buscar por nome, tag, categoria..." />
            <select v-model="filters.sort" class="field"><option value="featured">Destaques da Forja</option><option value="recent">Mais recentes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></select>
          </div>
          <div class="chip-row"><button v-for="tag in tagOptions.slice(0, 10)" :key="tag" class="tag-btn" :class="{ active: filters.tag === tag }" @click="filters.tag = filters.tag === tag ? 'all' : tag">#{{ tag }}</button></div>
          <div class="count-line"><span>{{ filtered.length }} item(ns) encontrado(s)</span><span>{{ filters.type === 'all' ? 'Todos os canais' : 'Filtro aplicado' }}</span></div>
          <ProductGrid :products="filtered" :loading="loading" />
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '../components/layout/PublicLayout.vue'
import ProductFilters from '../components/products/ProductFilters.vue'
import ProductGrid from '../components/products/ProductGrid.vue'
import { listPublicProducts } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
import { useProductsFilter } from '../composables/useProductsFilter'
import { itemListSchema, organizationSchema, useSeo } from '../composables/useSeo'
const route = useRoute()
const products = ref([]), categories = ref([]), loading = ref(true), drawer = ref(false)
const { filters, filtered, tagOptions, resetFilters } = useProductsFilter(products)
const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'
const whatsGeneral = computed(() => `https://wa.me/${number}?text=${encodeURIComponent('Olá! Quero fazer um pedido personalizado com a Forja Brindes.')}`)
function applyQuery() { if (route.query.busca) filters.search = route.query.busca; if (route.query.categoria) filters.category = route.query.categoria; updateSeo() }

function updateSeo() {
  const categoryName = categories.value.find((category) => category.id === filters.category)?.name
  const suffix = categoryName ? ` - ${categoryName}` : ''
  useSeo({
    title: `Catálogo de Produtos Personalizados${suffix} | Forja Brindes`,
    description: 'Explore canecas, camisetas, quadros e brindes personalizados da Forja Brindes. Filtre por coleção, raridade, preço, Shopee e itens sob encomenda.',
    path: '/produtos',
    image: filtered.value[0]?.image_url || '/logo.png',
    imageAlt: 'Catálogo de produtos personalizados Forja Brindes',
    structuredData: [organizationSchema(), itemListSchema(filtered.value, 'Catálogo de produtos personalizados da Forja Brindes')],
  })
}

watch(() => route.query, applyQuery)
watch(filters, updateSeo, { deep: true })
onMounted(async () => { updateSeo(); try { [products.value, categories.value] = await Promise.all([listPublicProducts(), listCategories()]); applyQuery(); updateSeo() } finally { loading.value = false } })
</script>
