<template>
  <AdminLayout :title="isEdit ? 'Editar item' : 'Novo item'" eyebrow="Inventário da Forja">
    <template #actions>
      <RouterLink class="btn btn-ghost" to="/admin/produtos">Voltar</RouterLink>
    </template>
    <form class="product-form" @submit.prevent="submit">
      <section class="admin-card form-section">
        <h2>Informações principais</h2>
        <div class="form-grid">
          <label>Nome do produto<input v-model="form.name" class="field" required @input="syncSlug" /></label>
          <label>Slug<input v-model="form.slug" class="field" required /></label>
          <label>Categoria<select v-model="form.category_id" class="field">
              <option value="">Sem categoria</option>
              <option v-for="cat in categories" :value="cat.id" :key="cat.id">{{ cat.name }}</option>
            </select></label>
          <label>Preço<input v-model="form.price" class="field" type="number" min="0" step="0.01"
              placeholder="Ex: 45" /></label>
          <label>Raridade<select v-model="form.rarity" class="field">
              <option>Comum</option>
              <option>Incomum</option>
              <option>Raro</option>
              <option>Épico</option>
              <option>Lendário</option>
            </select></label>
          <label>Estoque<input v-model="form.stock" class="field" type="number" min="0" /></label>
        </div>
        <label>Descrição curta<input v-model="form.short_description" class="field" maxlength="160"
            placeholder="Resumo do card" /></label>
        <label>Descrição completa<textarea v-model="form.description" class="field" rows="5"
            placeholder="Detalhes do item, uso e personalização"></textarea></label>
      </section>
      <section class="admin-card form-section">
        <h2>Imagens do produto</h2>
        <div class="form-grid two">
          <label>Imagem principal
            <ImageUploader v-model="form.image_url" label="Enviar imagem principal" />
          </label>
          <label>Galeria
            <ImageUploader v-model="form.gallery" label="Enviar imagens da galeria" multiple />
          </label>
        </div>
      </section>
      <section class="admin-card form-section">
        <h2>Venda, personalização e status</h2>
        <div class="form-grid">
          <label>Link da Shopee<input v-model="form.shopee_url" class="field"
              placeholder="https://shopee.com.br/..." /></label>
          <label>Ordem de destaque<input v-model="form.featured_rank" class="field" type="number" min="0" /></label>
          <label>Tipo de item<input v-model="form.item_type" class="field" placeholder="Caneca personalizada" /></label>
          <label>Material/base<input v-model="form.material" class="field"
              placeholder="Cerâmica, tecido, alumínio..." /></label>
        </div>
        <label>Observação de entrega<input v-model="form.delivery_note" class="field"
            placeholder="Entrega local combinada em Timon e Teresina" /></label>
        <label>Mensagem personalizada de WhatsApp<textarea v-model="form.whatsapp_message" class="field" rows="3"
            placeholder="Mensagem específica do item"></textarea></label>
        <label>Tags<input v-model="tagsText" class="field" placeholder="anime, gamer, presente" /></label>
        <div class="toggle-grid">
          <label><input v-model="form.is_active" type="checkbox" /> Produto ativo</label>
          <label><input v-model="form.is_featured" type="checkbox" /> Destaque</label>
          <label><input v-model="form.is_legendary" type="checkbox" /> Item lendário</label>
          <label><input v-model="form.is_customizable" type="checkbox" /> Personalizável</label>
          <label><input v-model="form.is_made_to_order" type="checkbox" /> Sob encomenda</label>
        </div>
      </section>
      <div class="form-actions"><button class="btn btn-ember" :disabled="saving">{{ saving ? 'Salvando...' : 'Salvar item'
          }}</button>
        <RouterLink class="btn btn-ghost" to="/admin/produtos">Cancelar</RouterLink>
      </div>
    </form>
  </AdminLayout>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import ImageUploader from '../components/admin/ImageUploader.vue'
import { listAdminProducts, saveProduct } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
import { useToast } from '../composables/useToast'
const route = useRoute(), { push } = useToast()
const categories = ref([]), saving = ref(false), originalId = ref(null), tagsText = ref('')
const initialForm = () => ({ name: '', slug: '', short_description: '', description: '', category_id: '', price: '', image_url: '', gallery: [], shopee_url: '', whatsapp_message: '', is_active: true, is_featured: false, is_legendary: false, is_customizable: true, is_made_to_order: false, stock: 0, tags: [], rarity: 'Comum', item_type: '', material: '', delivery_note: '', featured_rank: 0 })
const form = reactive(initialForm())
const isEdit = computed(() => Boolean(route.params.id))
function slugify(value) { return value.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
function syncSlug() { if (!isEdit.value || !form.slug) form.slug = slugify(form.name) }
function resetForm() { Object.assign(form, initialForm()); tagsText.value = ''; originalId.value = null }
function fill(product) { Object.assign(form, { ...initialForm(), ...product, category_id: product.category_id || '', price: product.price ?? '', gallery: product.gallery || [] }); originalId.value = product.id; tagsText.value = (product.tags || []).join(', ') }
async function submit() {
  saving.value = true
  try {
    const payload = { ...form, tags: tagsText.value.split(',').map((t) => t.trim()).filter(Boolean), has_shopee: Boolean(form.shopee_url) }
    const saved = await saveProduct(payload, originalId.value)
    if (isEdit.value) {
      fill(saved)
      push('Item atualizado com sucesso.')
    } else {
      resetForm()
      push('Item cadastrado com sucesso. Os campos foram limpos para um novo cadastro.')
    }
  } catch (e) {
    push(e.message || 'Erro ao salvar produto.', 'error')
  } finally {
    saving.value = false
  }
}
onMounted(async () => { categories.value = await listCategories(true); if (isEdit.value) { const all = await listAdminProducts(); const product = all.find((p) => p.id === route.params.id); if (product) fill(product) } })
</script>
<style scoped>
.product-form label {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-grid label {
  flex-direction: row;
  align-items: center;
}
</style>
