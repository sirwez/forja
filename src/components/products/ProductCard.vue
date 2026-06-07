<template>
  <article class="product-card">
    <RouterLink class="product-img" :to="`/produto/${product.slug}`">
      <img :src="product.image_url" :alt="`${product.name} - produto personalizado Forja Brindes`" loading="lazy" decoding="async" />
    </RouterLink>
    <div class="product-info">
      <div class="badges">
        <span class="badge" :class="rarityClass">{{ product.rarity || 'Comum' }}</span>
        <span v-if="product.shopee_url" class="badge shopee">Shopee</span>
        <span v-if="product.is_customizable" class="badge forgeable">Forjável</span>
        <span v-if="product.is_made_to_order" class="badge">Sob encomenda</span>
      </div>
      <div class="category-text">{{ product.category?.name || 'Item personalizado' }}</div>
      <h3>{{ product.name }}</h3>
      <p class="line-clamp">{{ product.short_description || product.description }}</p>
      <div class="mini-tags"><span v-for="tag in product.tags?.slice(0, 3)" :key="tag">#{{ tag }}</span></div>
      <div class="price">{{ product.price ? formatPrice(product.price) : 'Sob orçamento' }}</div>
      <div class="card-actions">
        <a v-if="product.shopee_url" class="btn btn-ember" :href="product.shopee_url" target="_blank" rel="noopener">Comprar na Shopee</a>
        <a v-else class="btn btn-ember" :href="whatsLink" target="_blank" rel="noopener">Forjar pelo WhatsApp</a>
        <RouterLink class="btn btn-ghost" :to="`/produto/${product.slug}`">Ver ficha</RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ product: { type: Object, required: true } })
const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'
const rarityClass = computed(() => ({ Raro: 'rare', Épico: 'epic', Lendário: 'legendary' }[props.product.rarity] || ''))
const whatsLink = computed(() => {
  const text = `Olá! Tenho interesse em forjar este item: ${props.product.name}. Gostaria de saber valores, personalização e prazo.`
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
})
function formatPrice(value) { return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
</script>
