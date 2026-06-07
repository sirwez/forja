<template>
  <AdminLayout title="Inventário" eyebrow="Gestão de produtos">
    <template #actions><RouterLink class="btn btn-ember" to="/admin/produtos/novo">Novo item</RouterLink></template>
    <section class="admin-card">
      <div class="admin-filters">
        <input v-model="search" class="field" placeholder="Buscar produto" />
        <select v-model="category" class="field"><option value="all">Todas as coleções</option><option v-for="cat in categories" :value="cat.id" :key="cat.id">{{ cat.name }}</option></select>
        <select v-model="status" class="field"><option value="all">Todos os status</option><option value="active">Ativos</option><option value="inactive">Inativos</option><option value="shopee">Com Shopee</option><option value="order">Sob encomenda</option></select>
        <select v-model="rarity" class="field"><option value="all">Todas raridades</option><option>Comum</option><option>Incomum</option><option>Raro</option><option>Épico</option><option>Lendário</option></select>
      </div>
    </section>
    <section class="admin-card table-card">
      <div class="admin-table desktop-table"><table class="table"><thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Raridade</th><th>Status</th><th>Ações</th></tr></thead><tbody><tr v-for="product in filtered" :key="product.id"><td><div class="td-product"><img :src="product.image_url" /><div><b>{{ product.name }}</b><span>{{ product.slug }}</span></div></div></td><td>{{ product.category?.name || '-' }}</td><td>{{ product.price ? formatPrice(product.price) : 'Sob orçamento' }}</td><td><span class="badge" :class="rarityClass(product)">{{ product.rarity }}</span></td><td><div class="status-pills"><span :class="['status', product.is_active ? 'ok' : 'off']">{{ product.is_active ? 'Ativo' : 'Inativo' }}</span><span v-if="product.shopee_url" class="status shopee">Shopee</span><span v-if="product.is_made_to_order" class="status">Sob encomenda</span></div></td><td><div class="row-actions"><RouterLink class="btn btn-ghost small" :to="`/admin/produtos/${product.id}/editar`">Editar</RouterLink><button class="btn btn-ghost small" @click="toggle(product)">{{ product.is_active ? 'Desativar' : 'Ativar' }}</button><button class="btn btn-ghost small" @click="copyProductLink(product)">Link</button><button class="btn btn-danger small" @click="remove(product)">Excluir</button></div></td></tr></tbody></table></div>
      <div class="mobile-admin-cards"><article v-for="product in filtered" :key="product.id" class="admin-product-card"><img :src="product.image_url" /><div><div class="badges"><span class="badge" :class="rarityClass(product)">{{ product.rarity }}</span><span :class="['badge', product.is_active ? 'forgeable' : '']">{{ product.is_active ? 'Ativo' : 'Inativo' }}</span></div><h3>{{ product.name }}</h3><p>{{ product.category?.name || 'Sem categoria' }} • {{ product.price ? formatPrice(product.price) : 'Sob orçamento' }}</p><div class="card-actions"><RouterLink class="btn btn-ghost" :to="`/admin/produtos/${product.id}/editar`">Editar</RouterLink><button class="btn btn-ghost" @click="toggle(product)">{{ product.is_active ? 'Desativar' : 'Ativar' }}</button></div></div></article></div>
    </section>
  </AdminLayout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import { deleteProduct, listAdminProducts, quickUpdateProduct } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
import { useToast } from '../composables/useToast'
const products = ref([]), categories = ref([]), search = ref(''), category = ref('all'), status = ref('all'), rarity = ref('all')
const { push } = useToast()
const filtered = computed(() => products.value.filter((p) => {
  const term = search.value.toLowerCase()
  const text = [p.name, p.slug, p.category?.name, ...(p.tags || [])].join(' ').toLowerCase()
  const bySearch = !term || text.includes(term)
  const byCategory = category.value === 'all' || p.category_id === category.value
  const byRarity = rarity.value === 'all' || p.rarity === rarity.value
  const byStatus = status.value === 'all' || (status.value === 'active' && p.is_active) || (status.value === 'inactive' && !p.is_active) || (status.value === 'shopee' && p.shopee_url) || (status.value === 'order' && p.is_made_to_order)
  return bySearch && byCategory && byRarity && byStatus
}))
function formatPrice(value) { return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function rarityClass(product) { return ({ Raro: 'rare', Épico: 'epic', Lendário: 'legendary' }[product.rarity] || '') }
async function load() { products.value = await listAdminProducts(); categories.value = await listCategories(true) }
async function toggle(product) { const updated = await quickUpdateProduct(product.id, { is_active: !product.is_active }); Object.assign(product, updated); push(product.is_active ? 'Item ativado.' : 'Item desativado.') }
async function remove(product) { if (!confirm(`Excluir ${product.name}?`)) return; await deleteProduct(product.id); products.value = products.value.filter((p) => p.id !== product.id); push('Produto excluído.') }
async function copyProductLink(product) { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#/produto/${product.slug}`); push('Link público copiado.') }
onMounted(load)
</script>
