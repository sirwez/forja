<template>
  <LoadingSkeleton v-if="loading" :count="6" />
  <EmptyState v-else-if="!products.length" title="Nenhum item encontrado" message="Ajuste os filtros ou chame a Forja para criar algo sob medida.">
    <a class="btn btn-ember" :href="whats" target="_blank" rel="noopener">Forjar pelo WhatsApp</a>
  </EmptyState>
  <div v-else class="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import LoadingSkeleton from '../ui/LoadingSkeleton.vue'
import EmptyState from '../ui/EmptyState.vue'
defineProps({ products: Array, loading: Boolean })
const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'
const whats = computed(() => `https://wa.me/${number}?text=${encodeURIComponent('Olá! Quero fazer um pedido personalizado com a Forja Brindes.')}`)
</script>
