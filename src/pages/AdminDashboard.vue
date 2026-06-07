<template>
  <AdminLayout title="Visão geral" eyebrow="Painel da Guilda">
    <template #actions>
      <RouterLink class="btn btn-ember" to="/admin/produtos/novo">Novo item</RouterLink>
    </template>
    <div class="metric-grid">
      <div class="metric-card"><span>Total</span><b>{{ products.length }}</b><small>itens cadastrados</small></div>
      <div class="metric-card"><span>Ativos</span><b>{{ active }}</b><small>visíveis na loja</small></div>
      <div class="metric-card"><span>Inativos</span><b>{{ inactive }}</b><small>ocultos do público</small></div>
      <div class="metric-card"><span>Shopee</span><b>{{ shopee }}</b><small>com link de compra</small></div>
      <div class="metric-card"><span>Sob encomenda</span><b>{{ order }}</b><small>orçamento via WhatsApp</small></div>
      <div class="metric-card"><span>Coleções</span><b>{{ categories.length }}</b><small>categorias cadastradas</small>
      </div>
    </div>
    <div class="admin-grid two">
      <section class="admin-card">
        <h2>Alertas da Forja</h2>
        <div class="alert" v-if="withoutImage.length">{{ withoutImage.length }} item(ns) sem imagem principal.</div>
        <div class="alert" v-if="withoutAction.length">{{ withoutAction.length }} item(ns) sem preço e sem mensagem de
          orçamento.</div>
        <p v-if="!withoutImage.length && !withoutAction.length" class="muted">Inventário saudável para apresentação ao
          cliente.</p>
      </section>
      <section class="admin-card">
        <h2>Atalhos</h2>
        <div class="quick-actions">
          <RouterLink class="btn btn-ember" to="/admin/produtos/novo">Cadastrar item</RouterLink>
          <RouterLink class="btn btn-ghost" to="/admin/produtos">Gerenciar inventário</RouterLink>
          <RouterLink class="btn btn-ghost" to="/admin/categorias">Coleções</RouterLink>
        </div>
      </section>
    </div>
    <section class="admin-card">
      <h2>Últimos itens cadastrados</h2>
      <div class="admin-list">
        <div v-for="product in products.slice(0, 6)" :key="product.id" class="admin-list-item"><img
            :src="product.image_url" />
          <div><b>{{ product.name }}</b><span>{{ product.category?.name || 'Sem categoria' }} • {{ product.rarity
              }}</span>
          </div>
          <RouterLink class="btn btn-ghost small" :to="`/admin/produtos/${product.id}/editar`">Editar</RouterLink>
        </div>
      </div>
    </section>
  </AdminLayout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import { listAdminProducts } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
const products = ref([]), categories = ref([])
const active = computed(() => products.value.filter((p) => p.is_active).length)
const inactive = computed(() => products.value.length - active.value)
const shopee = computed(() => products.value.filter((p) => p.shopee_url).length)
const order = computed(() => products.value.filter((p) => p.is_made_to_order).length)
const withoutImage = computed(() => products.value.filter((p) => !p.image_url))
const withoutAction = computed(() => products.value.filter((p) => !p.price && !p.whatsapp_message))
onMounted(async () => { products.value = await listAdminProducts(); categories.value = await listCategories(true) })
</script>
