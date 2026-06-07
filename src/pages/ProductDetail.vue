<template>
  <PublicLayout>
    <section class="product-detail">
      <div class="container">
        <div class="breadcrumb">
          <RouterLink to="/">Forja</RouterLink> / <RouterLink to="/produtos">Inventário</RouterLink> / {{ product?.name
            || 'Item' }}
        </div>
        <LoadingSkeleton v-if="loading" :count="2" />
        <EmptyState v-else-if="!product" title="Item não encontrado"
          message="Esse item pode ter sido removido ou está inativo.">
          <RouterLink class="btn btn-ember" to="/produtos">Voltar ao inventário</RouterLink>
        </EmptyState>
<div v-else class="detail-grid product-detail-grid">
  <div class="product-gallery-box">
    <button
      class="gallery-main gallery-trigger"
      type="button"
      @click="openLightbox(selectedImage)"
      aria-label="Ampliar imagem do produto"
    >
      <img :src="selectedImage" :alt="`${product.name} - produto personalizado Forja Brindes`" fetchpriority="high" decoding="async" />
    </button>

    <div class="thumbs product-thumbs" aria-label="Galeria do produto">
      <button
        v-for="image in gallery"
        :key="image"
        class="thumb"
        :class="{ active: selectedImage === image }"
        type="button"
        @click="selectedImage = image"
        @dblclick="openLightbox(image)"
      >
        <img :src="image" :alt="`${product.name} - imagem da galeria Forja Brindes`" loading="lazy" decoding="async" />
      </button>
    </div>
  </div>

  <aside class="detail-panel product-info-panel">
    <div class="badges">
      <span class="badge" :class="rarityClass">{{ product.rarity }}</span>
      <span v-if="product.shopee_url" class="badge shopee">Disponível na Shopee</span>
      <span v-if="product.is_customizable" class="badge forgeable">Personalizável</span>
      <span v-if="product.is_made_to_order" class="badge">Sob encomenda</span>
    </div>

    <h1 class="product-title">{{ product.name }}</h1>

    <p class="lead product-short-description">
      {{ product.short_description }}
    </p>

    <div class="price product-price">
      {{ product.price ? formatPrice(product.price) : 'Sob orçamento' }}
    </div>

    <div class="hero-actions product-actions">
      <a
        v-if="product.shopee_url"
        class="btn btn-ember"
        :href="product.shopee_url"
        target="_blank"
      >
        Comprar na Shopee
      </a>

      <a class="btn btn-ember" :href="whatsFor(product)" target="_blank">
        Forjar pelo WhatsApp
      </a>

      <button class="btn btn-ghost" type="button" @click="copyLink">
        Copiar link
      </button>
    </div>

    <div class="specs product-specs">
      <div class="spec">
        <span>Tipo de item</span>
        <b>{{ product.item_type || 'Produto personalizado' }}</b>
      </div>

      <div class="spec">
        <span>Material/base</span>
        <b>{{ product.material || 'Definido conforme personalização' }}</b>
      </div>

      <div class="spec">
        <span>Coleção</span>
        <b>{{ product.category?.name || 'Forja Brindes' }}</b>
      </div>

      <div class="spec">
        <span>Entrega</span>
        <b>{{ product.delivery_note || 'Combinada pelo WhatsApp' }}</b>
      </div>
    </div>
  </aside>
</div>
      </div>
    </section>
    <section v-if="product" class="section compact">
      <div class="container two-columns">
        <article class="rich-card">
          <div class="eyebrow">Descrição do item</div>
          <h2>Ficha do item</h2>
          <p class="product-description-text">{{ displayedDescription }}</p><button v-if="hasLongDescription"
            class="text-action" type="button" @click="descriptionExpanded = !descriptionExpanded">{{ descriptionExpanded
              ? 'Recolher descrição' : 'Ver descrição completa' }}</button>
          <div class="mini-tags"><span v-for="tag in product.tags" :key="tag">#{{ tag }}</span></div>
        </article>
        <article class="rich-card">
          <div class="eyebrow">Sistema de criação</div>
          <h2>Como personalizar</h2>
          <p>Envie nome, frase, personagem, foto, arte ou referência. A Forja valida a ideia, combina prazo e prepara a
            personalização antes da produção.</p><a class="btn btn-ember" :href="whatsFor(product)"
            target="_blank">Chamar a Forja</a>
        </article>
      </div>
    </section>
    <section v-if="related.length" class="section compact">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Itens relacionados</div>
            <h2>Outros itens da guilda</h2>
          </div>
          <RouterLink class="btn btn-ghost" to="/produtos">Ver catálogo</RouterLink>
        </div>
        <div class="related-grid">
          <ProductCard v-for="item in related" :key="item.id" :product="item" />
        </div>
      </div>
    </section>
    <div v-if="lightboxImage" class="image-lightbox" @click="closeLightbox">
      <button class="lightbox-close" type="button" @click.stop="closeLightbox">×</button>
      <img :src="lightboxImage" :alt="product?.name || 'Imagem ampliada do produto'" @click.stop />
    </div>
  </PublicLayout>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '../components/layout/PublicLayout.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ProductCard from '../components/products/ProductCard.vue'
import { getProductBySlug, listPublicProducts } from '../services/productsService'
import { useToast } from '../composables/useToast'
import { organizationSchema, productSchema, useSeo } from '../composables/useSeo'
const route = useRoute(); const { push } = useToast()
const product = ref(null), loading = ref(true), selectedImage = ref(''), all = ref([]), lightboxImage = ref(''), descriptionExpanded = ref(false)
const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'
const gallery = computed(() => [product.value?.image_url, ...(product.value?.gallery || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i))
const rarityClass = computed(() => ({ Raro: 'rare', Épico: 'epic', Lendário: 'legendary' }[product.value?.rarity] || ''))
const related = computed(() => all.value.filter((p) => p.id !== product.value?.id && (p.category_id === product.value?.category_id || p.rarity === product.value?.rarity)).slice(0, 3))
const descriptionLimit = 520
const hasLongDescription = computed(() => (product.value?.description || '').length > descriptionLimit)
const displayedDescription = computed(() => {
  const text = product.value?.description || 'Detalhes personalizados combinados diretamente com a Forja.'
  if (descriptionExpanded.value || text.length <= descriptionLimit) return text
  return `${text.slice(0, descriptionLimit).trim()}...`
})
function formatPrice(value) { return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function whatsFor(p) { return `https://wa.me/${number}?text=${encodeURIComponent(`Olá! Tenho interesse em forjar este item: ${p.name}. Categoria: ${p.category?.name || ''}. Link: ${location.href}. Gostaria de saber valores, personalização e prazo.`)}` }
async function copyLink() { await navigator.clipboard.writeText(location.href); push('Link copiado.') }
function openLightbox(image) { if (image) lightboxImage.value = image }
function closeLightbox() { lightboxImage.value = '' }

function updateSeo() {
  if (!product.value) {
    useSeo({
      title: 'Item não encontrado | Forja Brindes',
      description: 'Esse item pode ter sido removido ou está indisponível no catálogo da Forja Brindes.',
      path: route.fullPath,
      robots: 'noindex, follow',
    })
    return
  }

  const title = `${product.value.name} | Produto Personalizado Forja Brindes`
  const description = product.value.short_description || product.value.description || 'Produto personalizado da Forja Brindes, com atendimento pelo WhatsApp e compra pela Shopee quando disponível.'

  useSeo({
    title,
    description: description.slice(0, 158),
    path: `/produto/${product.value.slug}`,
    image: product.value.image_url || '/logo.png',
    imageAlt: `${product.value.name} - produto personalizado da Forja Brindes`,
    type: 'product',
    structuredData: [organizationSchema(), productSchema(product.value)],
  })
}

async function load() { loading.value = true; descriptionExpanded.value = false; try { product.value = await getProductBySlug(route.params.slug); selectedImage.value = product.value?.image_url || ''; all.value = await listPublicProducts(); updateSeo() } finally { loading.value = false } }
watch(() => route.params.slug, load)
onMounted(load)
</script>
