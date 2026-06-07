<template>
  <header class="topbar">
    <div class="container topbar-inner">
      <RouterLink class="brand" to="/">
        <img :src="logo" alt="Forja Brindes" />
        <div>
          <b>Forja Brindes</b>
          <span>Guilda de itens personalizados</span>
        </div>
      </RouterLink>

      <nav class="nav">
        <RouterLink :to="{ name: 'home' }">Loja</RouterLink>
        <RouterLink :to="{ name: 'products' }">Catálogo</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#collections' }">Coleções</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#forge' }">Personalizar</RouterLink>
        <RouterLink :to="{ name: 'home', hash: '#contact' }">Contato</RouterLink>
      </nav>

      <div class="search-mini">
        <span>⌕</span>
        <input
          v-model="term"
          @keydown.enter="goSearch"
          placeholder="Buscar item..."
        />
      </div>

      <a
        class="btn btn-ember desktop-cta"
        :href="whatsGeneral"
        target="_blank"
        rel="noopener"
      >
        Forjar pedido
      </a>

      <button class="hamb" @click="open = !open" aria-label="Abrir menu">
        ☰
      </button>
    </div>

    <div class="mobile-drawer" :class="{ open }">
      <input
        v-model="term"
        @keydown.enter="goSearch"
        placeholder="Buscar produto"
      />

      <RouterLink :to="{ name: 'products' }" @click="open = false">
        Catálogo
      </RouterLink>

      <RouterLink :to="{ name: 'home', hash: '#collections' }" @click="open = false">
        Coleções
      </RouterLink>

      <RouterLink :to="{ name: 'home', hash: '#forge' }" @click="open = false">
        Personalizar
      </RouterLink>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <a
    class="whats-float btn btn-ember"
    :href="whatsGeneral"
    target="_blank"
    rel="noopener"
    aria-label="WhatsApp"
  >
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.52 3.48A11.8 11.8 0 0 0 12.14 0C5.62 0 .31 5.31.31 11.83c0 2.08.54 4.11 1.58 5.9L.21 24l6.42-1.68a11.78 11.78 0 0 0 5.51 1.4h.01c6.52 0 11.83-5.31 11.83-11.83a11.76 11.76 0 0 0-3.46-8.41ZM12.15 21.7a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.81 1 1.02-3.72-.24-.38a9.77 9.77 0 0 1-1.5-5.18c0-5.43 4.42-9.85 9.86-9.85a9.8 9.8 0 0 1 6.97 2.89 9.8 9.8 0 0 1 2.89 6.97c.01 5.44-4.41 9.86-9.83 9.86Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  </a>

  <button
    class="top-float btn btn-ghost"
    :class="{ show: showTop }"
    @click="scrollTop"
    aria-label="Voltar ao topo"
  >
    ↑
  </button>

  <footer class="footer footer-forge" id="contact">
    <div class="footer-glow" aria-hidden="true"></div>
    <div class="footer-sparks" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

    <div class="container footer-cta">
      <div>
        <span class="eyebrow">Balcão da Forja</span>
        <h2>Tem uma ideia de item personalizado?</h2>
        <p>
          Chame a Forja no WhatsApp, envie sua referência e combine o melhor
          caminho: orçamento direto, entrega local ou compra pela Shopee.
        </p>
      </div>

      <a
        class="btn btn-ember footer-cta-button"
        :href="whatsGeneral"
        target="_blank"
        rel="noopener"
      >
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.52 3.48A11.8 11.8 0 0 0 12.14 0C5.62 0 .31 5.31.31 11.83c0 2.08.54 4.11 1.58 5.9L.21 24l6.42-1.68a11.78 11.78 0 0 0 5.51 1.4h.01c6.52 0 11.83-5.31 11.83-11.83a11.76 11.76 0 0 0-3.46-8.41ZM12.15 21.7a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.81 1 1.02-3.72-.24-.38a9.77 9.77 0 0 1-1.5-5.18c0-5.43 4.42-9.85 9.86-9.85a9.8 9.8 0 0 1 6.97 2.89 9.8 9.8 0 0 1 2.89 6.97c.01 5.44-4.41 9.86-9.83 9.86Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
          />
        </svg>
        Forjar pedido
      </a>
    </div>

    <div class="container footer-grid footer-main-grid">
      <div class="footer-brand-block">
        <RouterLink class="brand footer-brand" to="/">
          <img :src="logo" alt="Forja" />
          <div>
            <b>Forja Brindes</b>
            <span>Guilda moderna de criação</span>
          </div>
        </RouterLink>

        <p>
          Itens personalizados forjados para transformar ideias em presentes,
          memórias e estilo.
        </p>

        <div class="footer-runes" aria-label="Estilos da Forja">
          <span>RPG</span>
          <span>Geek</span>
          <span>Otaku</span>
          <span>Sob encomenda</span>
        </div>
      </div>

      <nav class="footer-nav" aria-label="Mapa da guilda">
        <h4>Mapa da guilda</h4>

        <RouterLink :to="{ name: 'home' }">
          Balcão da Forja
        </RouterLink>

        <RouterLink :to="{ name: 'products' }">
          Catálogo de itens
        </RouterLink>

        <RouterLink :to="{ name: 'home', hash: '#collections' }">
          Coleções
        </RouterLink>

        <RouterLink :to="{ name: 'home', hash: '#forge' }">
          Personalizar
        </RouterLink>
      </nav>

      <address class="footer-contact">
        <h4>Atendimento</h4>

        <a
          class="social-card whatsapp-card"
          :href="whatsGeneral"
          target="_blank"
          rel="noopener"
        >
          <span class="social-icon whatsapp-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M20.52 3.48A11.8 11.8 0 0 0 12.14 0C5.62 0 .31 5.31.31 11.83c0 2.08.54 4.11 1.58 5.9L.21 24l6.42-1.68a11.78 11.78 0 0 0 5.51 1.4h.01c6.52 0 11.83-5.31 11.83-11.83a11.76 11.76 0 0 0-3.46-8.41ZM12.15 21.7a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.81 1 1.02-3.72-.24-.38a9.77 9.77 0 0 1-1.5-5.18c0-5.43 4.42-9.85 9.86-9.85a9.8 9.8 0 0 1 6.97 2.89 9.8 9.8 0 0 1 2.89 6.97c.01 5.44-4.41 9.86-9.83 9.86Zm5.4-7.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"
              />
            </svg>
          </span>

          <span>
            <b>WhatsApp</b>
            <small>Faça orçamento ou personalize um item</small>
          </span>
        </a>

        <a
          class="social-card instagram-card"
          href="https://www.instagram.com/forjabrindes/"
          target="_blank"
          rel="noopener"
        >
          <span class="social-icon instagram-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.05a1.35 1.35 0 1 1 0 2.7 1.35 1.35 0 0 1 0-2.7ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"
              />
            </svg>
          </span>

          <span>
            <b>@forjabrindes</b>
            <small>Veja peças que saíram da forja</small>
          </span>
        </a>
      </address>

      <div class="footer-hours">
        <h4>Horário da forja</h4>

        <div class="hour-card">
          <span class="hour-day">Segunda a sexta</span>
          <strong>8h às 20h</strong>
        </div>

        <div class="hour-card">
          <span class="hour-day">Sábado</span>
          <strong>8h às 15h</strong>
        </div>

        <div class="delivery-card">
          <span>Entregas locais</span>
          <b>Timon e Teresina</b>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <small>© 2026 Forja Brindes. Todos os direitos reservados.</small>

      <a
        class="made-by"
        href="https://www.walpurgis.com.br/"
        target="_blank"
        rel="noopener"
        aria-label="Site desenvolvido por Walpurgis"
      >
        <span>Feito por</span>
        <strong>Walpurgis</strong>
      </a>
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from '../../assets/logo.png'

const router = useRouter()

const open = ref(false)
const term = ref('')
const showTop = ref(false)

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '558688843379'

const whatsGeneral = computed(() => {
  const message = 'Olá! Quero fazer um pedido personalizado com a Forja Brindes.'
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
})

function goSearch() {
  router.push({
    path: '/produtos',
    query: {
      busca: term.value,
    },
  })

  open.value = false
}

function onScroll() {
  showTop.value = window.scrollY > 420
}

function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.footer-forge {
  position: relative;
  overflow: hidden;
  padding: 4.5rem 0 1.35rem;
  border-top: 1px solid rgba(255, 194, 71, 0.22);
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 90, 31, 0.22), transparent 32rem),
    radial-gradient(circle at 82% 10%, rgba(255, 194, 71, 0.14), transparent 26rem),
    linear-gradient(180deg, rgba(11, 11, 13, 0.96), #070707 58%, #030303);
}

.footer-glow {
  position: absolute;
  inset: auto 8% -80px 8%;
  height: 170px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255, 90, 31, 0.28), transparent 66%);
  filter: blur(18px);
}

.footer-sparks {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.footer-sparks span {
  position: absolute;
  bottom: -20px;
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: #ffc247;
  box-shadow: 0 0 18px rgba(255, 194, 71, 0.85);
  opacity: 0.65;
  animation: footerSpark 8s linear infinite;
}

.footer-sparks span:nth-child(1) {
  left: 12%;
  animation-delay: 0s;
}

.footer-sparks span:nth-child(2) {
  left: 38%;
  animation-delay: 2s;
}

.footer-sparks span:nth-child(3) {
  left: 64%;
  animation-delay: 4.2s;
}

.footer-sparks span:nth-child(4) {
  left: 88%;
  animation-delay: 1.1s;
}

@keyframes footerSpark {
  from {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }

  20% {
    opacity: 0.8;
  }

  to {
    transform: translateY(-320px) scale(1.2);
    opacity: 0;
  }
}

.footer-cta {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1.4rem;
  align-items: center;
  margin-bottom: 2.3rem;
  padding: 1.45rem;
  border: 1px solid rgba(255, 194, 71, 0.28);
  border-radius: 1.45rem;
  background:
    linear-gradient(135deg, rgba(255, 90, 31, 0.12), rgba(255, 194, 71, 0.05)),
    rgba(255, 255, 255, 0.035);
  box-shadow: 0 22px 80px rgba(0, 0, 0, 0.34);
}

.footer-cta h2 {
  margin: 0.15rem 0 0.35rem;
  max-width: 720px;
  font-size: clamp(1.65rem, 3vw, 2.75rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.footer-cta p {
  max-width: 760px;
  margin: 0;
  color: rgba(255, 247, 234, 0.74);
  line-height: 1.65;
}

.footer-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  box-shadow:
    0 14px 32px rgba(255, 90, 31, 0.32),
    0 4px 12px rgba(0, 0, 0, 0.28);
}

.footer-cta-button:hover {
  box-shadow:
    0 18px 38px rgba(255, 90, 31, 0.42),
    0 6px 16px rgba(0, 0, 0, 0.34);
}

.desktop-cta,
.whats-float {
  box-shadow:
    0 12px 28px rgba(255, 90, 31, 0.28),
    0 4px 10px rgba(0, 0, 0, 0.22);
}

.desktop-cta:hover,
.whats-float:hover {
  box-shadow:
    0 16px 34px rgba(255, 90, 31, 0.38),
    0 6px 14px rgba(0, 0, 0, 0.28);
}

.icon {
  width: 1.1rem;
  height: 1.1rem;
}

.footer-main-grid {
  position: relative;
  display: grid;
  grid-template-columns:
    minmax(250px, 1.2fr)
    minmax(170px, 0.7fr)
    minmax(260px, 0.95fr)
    minmax(230px, 0.85fr);
  gap: 1.6rem;
  align-items: start;
  padding-block: 1.7rem 2rem;
}

.footer-main-grid h4 {
  margin: 0 0 0.9rem;
  color: #fff7ea;
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.footer-brand-block p {
  max-width: 360px;
  margin: 1rem 0 1rem;
  color: rgba(255, 247, 234, 0.7);
  line-height: 1.65;
}

.footer-brand {
  align-items: center;
}

.footer-brand img {
  width: 74px;
  max-height: 46px;
  object-fit: contain;
}

.footer-runes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.footer-runes span {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.4rem 0.68rem;
  border: 1px solid rgba(255, 194, 71, 0.22);
  border-radius: 999px;
  color: rgba(255, 194, 71, 0.96);
  background: rgba(255, 194, 71, 0.06);
  font-size: 0.78rem;
  font-weight: 800;
}

.footer-nav {
  display: grid;
  gap: 0.58rem;
}

.footer-nav a,
.footer-contact a {
  color: rgba(255, 247, 234, 0.72);
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.footer-nav a:hover,
.footer-contact a:hover {
  color: #ffc247;
}

.footer-contact {
  display: grid;
  gap: 0.72rem;
  font-style: normal;
}

.social-card {
  display: grid;
  grid-template-columns: 2.65rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 0.78rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.035);
}

.social-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 194, 71, 0.33);
  background: rgba(255, 194, 71, 0.07);
}

.social-card b {
  display: block;
  color: #fff7ea;
  line-height: 1.15;
}

.social-card small {
  display: block;
  margin-top: 0.2rem;
  color: rgba(255, 247, 234, 0.58);
  line-height: 1.35;
}

.social-icon {
  width: 2.65rem;
  height: 2.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  color: #0b0b0d;
  background: linear-gradient(135deg, #ffc247, #ff5a1f);
  box-shadow: 0 12px 30px rgba(255, 90, 31, 0.22);
}

.social-icon svg {
  width: 1.22rem;
  height: 1.22rem;
}

.instagram-card .social-icon {
  color: #fff;
  background: linear-gradient(135deg, #7c3aed, #ec4899 48%, #ff8a1f);
}

.footer-hours {
  display: grid;
  gap: 0.72rem;
}

.hour-card,
.delivery-card {
  padding: 0.86rem 0.92rem;
  border: 1px solid rgba(255, 194, 71, 0.18);
  border-radius: 1rem;
  background:
    linear-gradient(135deg, rgba(255, 194, 71, 0.08), rgba(255, 255, 255, 0.025)),
    rgba(255, 255, 255, 0.025);
}

.hour-day,
.delivery-card span {
  display: block;
  margin-bottom: 0.22rem;
  color: rgba(255, 247, 234, 0.58);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hour-card strong,
.delivery-card b {
  color: #fff7ea;
  font-size: 1.05rem;
}

.footer-bottom {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding-top: 1.15rem;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  color: rgba(255, 247, 234, 0.55);
}

.made-by {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.65rem;
  border: 1px solid rgba(255, 194, 71, 0.18);
  border-radius: 999px;
  color: rgba(255, 247, 234, 0.68);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.035);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.made-by:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 194, 71, 0.42);
  color: #ffc247;
}

.made-by span {
  font-size: 0.78rem;
}

.made-by strong {
  color: #ffc247;
  letter-spacing: 0.02em;
}

@media (max-width: 980px) {
  .footer-main-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-cta {
    grid-template-columns: 1fr;
  }

  .footer-cta-button {
    width: fit-content;
  }
}

@media (max-width: 640px) {
  .footer-forge {
    padding-top: 3rem;
    padding-bottom: 6.5rem;
  }

  .footer-cta {
    padding: 1.1rem;
    border-radius: 1.2rem;
  }

  .footer-cta h2 {
    font-size: 1.65rem;
  }

  .footer-cta-button {
    width: 100%;
    justify-content: center;
  }

  .footer-main-grid {
    grid-template-columns: 1fr;
    gap: 1.45rem;
  }

  .footer-brand img {
    width: 68px;
  }

  .footer-nav {
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.025);
  }

  .social-card {
    grid-template-columns: 2.55rem minmax(0, 1fr);
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .made-by {
    width: 100%;
    justify-content: center;
  }
}
</style>