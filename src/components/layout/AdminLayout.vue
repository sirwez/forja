<template>
  <div class="admin-shell">
    <aside class="admin-side">
      <RouterLink class="brand admin-brand admin-brand--stacked" to="/admin">
        <img :src="logo" alt="Forja" />
        <div class="admin-brand__text"><b>Painel da Guilda</b><span>Gestão da Forja</span></div>
      </RouterLink>
      <nav class="admin-nav">
        <RouterLink to="/admin">Visão geral</RouterLink>
        <RouterLink to="/admin/produtos">Inventário</RouterLink>
        <RouterLink to="/admin/produtos/novo">Novo item</RouterLink>
        <RouterLink to="/admin/categorias">Coleções</RouterLink>
        <RouterLink to="/">Ver loja</RouterLink>
        <a href="#" @click.prevent="logout">Sair</a>
      </nav>
    </aside>
    <section class="admin-main">
      <header class="admin-header">
        <div>
          <span class="eyebrow">{{ eyebrow }}</span>
          <h1>{{ title }}</h1>
        </div>
        <slot name="actions" />
      </header>
      <slot />
    </section>
    <nav class="admin-bottom-nav admin-bottom-nav--inline">
      <RouterLink to="/admin">Painel</RouterLink>
      <RouterLink to="/admin/produtos">Itens</RouterLink>
      <RouterLink to="/admin/produtos/novo">Novo</RouterLink>
      <RouterLink to="/admin/categorias">Coleções</RouterLink>
      <a href="#" @click.prevent="logout">Sair</a>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { signOut } from '../../services/authService'
import logo from '../../assets/logo.png'

defineProps({ title: String, eyebrow: { type: String, default: 'Painel da Guilda' } })
const router = useRouter()
async function logout() {
  await signOut()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-brand--stacked {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.admin-brand__text {
  display: flex;
  flex-direction: column;
}

.admin-bottom-nav--inline {
  display: flex;
  flex-wrap: nowrap;
}

.admin-bottom-nav--inline > * {
  flex: 1 1 0;
  min-width: 0;
  white-space: nowrap;
}
</style>
