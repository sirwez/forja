<template>
  <section class="login-page">
    <div class="login-card">
      <img :src="logo" alt="Forja" class="login-logo" />
      <div class="eyebrow">Painel da Guilda</div>
      <h1>Acesso administrativo</h1>
      <p>Entre com um usuário autorizado em <code>admin_users</code>. O painel controla o inventário, coleções e imagens
        da loja.</p>
      <form @submit.prevent="submit">
        <label>Email</label><input v-model="email" class="field" type="email" required placeholder="admin@email.com" />
        <label>Senha</label><input v-model="password" class="field" style="margin-bottom: 15px;" type="password" required placeholder="••••••••" />
        <button class="btn btn-ember w-full" :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar no Painel'
          }}</button>
      </form>
      <RouterLink to="/" class="back-store">← Voltar para a loja</RouterLink>
    </div>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signIn } from '../services/authService'
import { useToast } from '../composables/useToast'
import logo from '../assets/logo.png'
const email = ref(''), password = ref(''), loading = ref(false)
const router = useRouter(), route = useRoute(), { push } = useToast()
async function submit() { loading.value = true; try { await signIn(email.value, password.value); push('Bem-vindo ao Painel da Guilda.'); router.push(route.query.redirect || '/admin') } catch (e) { push(e.message || 'Erro no login.', 'error') } finally { loading.value = false } }
</script>
