<template>
  <PublicLayout>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          
          <h1>Itens personalizados para a sua próxima aventura.</h1>
          <p>Escolha uma base, envie sua ideia e deixe a Forja transformar em uma peça única. Uma Geek Store com
            canecas, quadros, camisetas e brindes feitos para presentear, colecionar e vender estilo.</p>
          <div class="hero-actions">
            <RouterLink class="btn btn-ember" to="/produtos">Explorar itens</RouterLink>
            <a class="btn btn-ghost" :href="whatsGeneral" target="_blank" rel="noopener">Forjar meu pedido</a>
          </div>
          <div class="guild-proof">
            <div class="trust"><b>Atendimento</b><span>pedido direto pelo WhatsApp</span></div>
            <div class="trust"><b>Shopee</b><span>compra por link quando disponível</span></div>
            <div class="trust"><b>Entrega local</b><span>Timon e Teresina</span></div>
          </div>
        </div>
        <div class="forge-window forge-showcase guild-showcase-v3">
          <div class="forge-head">
            <div>
              <div class="eyebrow">Balcão da guilda</div>
              <h2>Escolha o item. Envie sua ideia. A Forja cria.</h2>
            </div>
            <span class="seal">Forjado sob medida</span>
          </div>

          <div class="guild-board">
            <div class="guild-board-glow"></div>
            <RouterLink v-if="heroItems[0]" class="guild-main-card" :to="`/produto/${heroItems[0].slug}`">
              <span class="guild-rarity">{{ heroItems[0].rarity || 'Item raro' }}</span>
              <figure>
                <img :src="heroItems[0].image_url" :alt="`${heroItems[0].name} - item personalizado em destaque`" fetchpriority="high" decoding="async" />
              </figure>
              <div class="guild-item-info">
                <div>
                  <small>{{ heroItems[0].category?.name || heroItems[0].item_type || 'Item personalizado' }}</small>
                  <b>{{ heroItems[0].name }}</b>
                </div>
                <strong>{{ heroItems[0].price ? formatPrice(heroItems[0].price) : 'Sob orçamento' }}</strong>
              </div>
            </RouterLink>

            <div class="guild-side-panel">
              <div class="guild-mission-card">
                <span>Missão de criação</span>
                <b>Personalize com tema, nome, frase, foto ou arte.</b>
                <p>A Forja combina o pedido antes da produção e direciona para WhatsApp ou Shopee.</p>
              </div>
              <div class="guild-mini-grid">
                <RouterLink v-for="item in heroItems.slice(1, 3)" :key="item.id" class="guild-mini-card"
                  :to="`/produto/${item.slug}`">
                  <img :src="item.image_url" :alt="`${item.name} - produto personalizado Forja Brindes`" loading="lazy" decoding="async" />
                  <div><span>{{ item.rarity || 'Forjável' }}</span><b>{{ item.name }}</b></div>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

<section class="ember-separator" id="collections" aria-hidden="true">
  <div class="container">
    <div class="ember-separator-line">
      <span></span>
    </div>
  </div>
</section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Coleções da guilda</div>
            <h2>Escolha sua coleção</h2>
            <p class="lead">Categorias com cara de cartas de loja: simples de entender, mas com atmosfera geek.</p>
          </div>
          <RouterLink class="btn btn-ghost" to="/produtos">Ver catálogo</RouterLink>
        </div>
        <div class="collection-cards">
          <article v-for="category in categories" :key="category.id" class="collection-card"
            @click="goCategory(category)">
            <i>{{ category.icon }}</i>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p><span>Abrir coleção →</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="legendary">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Destaque da Forja</div>
            <h2>Item lendário da semana</h2>
            <p class="lead">Um destaque visual para o cliente enxergar valor e imaginar o produto pronto.</p>
          </div>
          <RouterLink class="btn btn-ghost" to="/produtos">Ver todos</RouterLink>
        </div>
        <div v-if="legendary" class="legendary-card">
          <div class="photo"><img :src="legendary.image_url" :alt="`${legendary.name} - item lendário da Forja Brindes`" loading="lazy" decoding="async" /></div>
          <div>
            <div class="badges"><span class="badge legendary">{{ legendary.rarity }}</span><span
                v-if="legendary.is_made_to_order" class="badge">Sob encomenda</span></div>
            <h3>{{ legendary.name }}</h3>
            <p>
              {{ truncateText(legendary.description, LEGENDARY_DESC_LIMIT) }}
              <RouterLink v-if="legendary.description && legendary.description.length > LEGENDARY_DESC_LIMIT"
                :to="`/produto/${legendary.slug}`">Ver mais</RouterLink>
            </p>
            <div class="price">{{ legendary.price ? formatPrice(legendary.price) : 'Sob orçamento' }}</div>
            <div class="hero-actions">
              <RouterLink class="btn btn-ember" :to="`/produto/${legendary.slug}`">Ver ficha do item</RouterLink><a
                class="btn btn-ghost" :href="whatsFor(legendary)" target="_blank" rel="noopener">Forjar parecido</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="store">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Inventário disponível</div>
            <h2>Inventário da Forja</h2>
            <p class="lead">Prévia dos itens com foco em produto, preço, raridade e ação rápida.</p>
          </div>
          <RouterLink class="btn btn-ember" to="/produtos">Abrir loja completa</RouterLink>
        </div>
        <ProductGrid :products="featured" :loading="loading" />
      </div>
    </section>

    <section class="section" id="shopee">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Insígnias de confiança</div>
            <h2>Compra clara, criação combinada</h2>
            <p class="lead">A estética é RPG, mas a experiência passa segurança para qualquer cliente.</p>
          </div>
        </div>
        <div class="confidence-grid">
          <div class="confidence-card" v-for="item in trust" :key="item.title"><i>{{ item.icon }}</i><b>{{ item.title
              }}</b>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="forge">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Sistema de criação</div>
            <h2>Forje o seu item personalizado</h2>
            <p class="lead">Um fluxo simples, com atmosfera de RPG/manhwa, mas feito para vender de forma clara.</p>
          </div>
        </div>
        <div class="forge-steps">
          <div class="step"><i>⚒️</i><b>1. Escolha a base</b>
            <p>Caneca, quadro, camiseta, copo ou brinde.</p>
          </div>
          <div class="step"><i>📜</i><b>2. Envie sua ideia</b>
            <p>Nome, frase, foto, personagem, referência ou tema.</p>
          </div>
          <div class="step"><i>🔥</i><b>3. A Forja cria</b>
            <p>A personalização é preparada conforme o produto escolhido.</p>
          </div>
          <div class="step"><i>📦</i><b>4. Receba ou compre</b>
            <p>Combine pelo WhatsApp, receba localmente ou use Shopee.</p>
          </div>
          <div class="step cta-step"><i>💬</i><b>5. Chame a Forja</b>
            <p>Abra o WhatsApp e envie sua ideia para orçamento.</p><a class="btn btn-ember w-full" :href="whatsGeneral"
              target="_blank" rel="noopener">Forjar pelo WhatsApp</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="social">
      <div class="container">
        <div class="section-head">
          <div>
            <div class="eyebrow">Vitrine social</div>
            <h2>Peças que saíram da Forja</h2>
            <p class="lead">Embed do Instagram com fallback para apresentação ao cliente.</p>
          </div><a class="btn btn-ghost" href="https://www.instagram.com/forjabrindes/" target="_blank">Ver
            Instagram</a>
        </div>
        <div class="social-box">
          <div class="elfsight-app-93e99fc6-c322-42bf-ac50-18b49ebe7817" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PublicLayout from '../components/layout/PublicLayout.vue'
import ProductGrid from '../components/products/ProductGrid.vue'
import { listPublicProducts } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
import { itemListSchema, organizationSchema, useSeo, websiteSchema } from '../composables/useSeo'

const router = useRouter()
const products = ref([])
const categories = ref([])
const loading = ref(true)
const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'
const whatsGeneral = computed(() => `https://wa.me/${number}?text=${encodeURIComponent('Olá! Quero fazer um pedido personalizado com a Forja Brindes.')}`)
const trust = [
  { icon: '💬', title: 'WhatsApp direto', text: 'Atendimento rápido para tirar dúvidas e combinar personalização.' },
  { icon: '📍', title: 'Timon e Teresina', text: 'Entrega local combinada conforme produto e disponibilidade.' },
  { icon: '🧾', title: 'Compra clara', text: 'Produtos com Shopee usam o anúncio oficial cadastrado.' },
  { icon: '🛠️', title: 'Sob encomenda', text: 'Personalização combinada antes da produção.' },
  { icon: '⭐', title: 'Peça única', text: 'A ideia do cliente vira item personalizado.' },
]
const LEGENDARY_DESC_LIMIT = 140
const featured = computed(() => products.value.filter((p) => p.is_featured).slice(0, 6))
const legendary = computed(() => products.value.find((p) => p.is_legendary) || products.value[0])
const heroItems = computed(() => featured.value.slice(0, 3))
function formatPrice(value) { return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function truncateText(text, limit = 140) {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text
}
function whatsFor(product) { return `https://wa.me/${number}?text=${encodeURIComponent(`Olá! Tenho interesse em forjar este item: ${product.name}. Gostaria de saber valores, personalização e prazo.`)}` }
function goCategory(category) { router.push({ path: '/produtos', query: { categoria: category.id } }) }

function updateSeo() {
  useSeo({
    title: 'Forja Brindes | Geek Store de Produtos Personalizados em Timon e Teresina',
    description: 'Canecas, quadros, camisetas e brindes personalizados com estética geek, otaku e gamer. Produtos sob encomenda, compra pela Shopee e entrega local em Timon e Teresina.',
    path: '/',
    image: heroItems.value[0]?.image_url || '/logo.png',
    imageAlt: 'Produtos personalizados da Forja Brindes',
    structuredData: [organizationSchema(), websiteSchema(), itemListSchema(featured.value, 'Itens em destaque da Forja Brindes')],
  })
}

onMounted(async () => {
  updateSeo()
  if (!document.querySelector('script[src=\"https://elfsightcdn.com/platform.js\"]')) {
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)
  }
  try { [products.value, categories.value] = await Promise.all([listPublicProducts(), listCategories()]); updateSeo() } finally { loading.value = false }
})
</script>

<style scoped>
.ember-separator {
  padding: 1.1rem 0 0.7rem;
}

.ember-separator-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 194, 71, 0.22),
    rgba(255, 90, 31, 0.38),
    rgba(255, 194, 71, 0.22),
    transparent
  );
  box-shadow: 0 0 24px rgba(255, 90, 31, 0.18);
}</style>