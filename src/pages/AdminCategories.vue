<template>
  <AdminLayout title="Coleções" eyebrow="Categorias da loja">
    <section class="admin-card categories-header-card">
      <div>
        <h2>Gerencie as coleções da Forja</h2>
        <p>
          Organize os produtos por categorias, como Canecas, Camisetas,
          Geek & Otaku, Gamer, Presentes e Sob encomenda.
        </p>
      </div>

      <button class="btn btn-ember" type="button" @click="openCreateModal">
        Nova coleção
      </button>
    </section>

    <section class="admin-card">
      <div class="section-title-row">
        <div>
          <h2>Coleções cadastradas</h2>
          <p>{{ categories.length }} coleção(ões) no inventário da Forja</p>
        </div>
      </div>

      <div v-if="loading" class="category-list">
        <article v-for="item in 3" :key="item" class="category-admin-card skeleton-card">
          <div class="skeleton-icon"></div>
          <div class="skeleton-content">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </article>
      </div>

      <div v-else-if="!categories.length" class="empty-admin-state">
        <strong>Nenhuma coleção cadastrada</strong>
        <p>Crie a primeira coleção para organizar os itens da loja.</p>
        <button class="btn btn-ember" type="button" @click="openCreateModal">
          Criar primeira coleção
        </button>
      </div>

      <div v-else class="category-list">
        <article
          v-for="cat in categories"
          :key="cat.id"
          class="category-admin-card"
          :class="{ inactive: !cat.is_active }"
        >
          <i>{{ cat.icon || '✦' }}</i>

          <div class="category-info">
            <div class="category-title-line">
              <h3>{{ cat.name }}</h3>
              <span class="status-pill" :class="{ active: cat.is_active }">
                {{ cat.is_active ? 'Ativa' : 'Inativa' }}
              </span>
            </div>

            <p>
              {{ cat.description || 'Sem descrição cadastrada.' }}
            </p>

            <span class="category-slug">
              /{{ cat.slug }}
            </span>
          </div>

          <div class="row-actions">
            <button class="btn btn-ghost small" type="button" @click="openEditModal(cat)">
              Editar
            </button>

            <button class="btn btn-danger small" type="button" @click="remove(cat)">
              Excluir
            </button>
          </div>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="modalOpen"
          class="category-modal-backdrop"
          @click.self="closeModal"
        >
          <section
            class="category-modal"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="modalTitleId"
          >
            <header class="category-modal-header">
              <div>
                <span class="eyebrow">
                  {{ editingId ? 'Editar coleção' : 'Nova coleção' }}
                </span>

                <h2 :id="modalTitleId">
                  {{ editingId ? 'Atualizar coleção' : 'Criar coleção' }}
                </h2>

                <p>
                  {{ editingId
                    ? 'Ajuste os dados desta coleção no inventário da loja.'
                    : 'Crie uma nova coleção para organizar os produtos da Forja.' }}
                </p>
              </div>

              <button
                class="modal-close"
                type="button"
                aria-label="Fechar modal"
                @click="closeModal"
              >
                ×
              </button>
            </header>

            <form class="category-form" @submit.prevent="submit">
              <div class="form-grid">
                <label>
                  Nome
                  <input
                    v-model="form.name"
                    class="field"
                    required
                    placeholder="Ex: Canecas"
                    @input="syncSlug"
                  />
                </label>

                <label>
                  Slug
                  <input
                    v-model="form.slug"
                    class="field"
                    required
                    placeholder="canecas"
                  />
                </label>

                <label>
                  Ícone
                  <input
                    v-model="form.icon"
                    class="field"
                    placeholder="☕"
                  />
                </label>

                <label>
                  Status
                  <select v-model="form.is_active" class="field">
                    <option :value="true">Ativa</option>
                    <option :value="false">Inativa</option>
                  </select>
                </label>
              </div>

              <label>
                Descrição
                <textarea
                  v-model="form.description"
                  class="field textarea-field"
                  rows="4"
                  placeholder="Descreva o tipo de produto desta coleção."
                ></textarea>
              </label>

              <div class="modal-preview">
                <span>Prévia da coleção</span>

                <article class="category-preview-card">
                  <i>{{ form.icon || '✦' }}</i>

                  <div>
                    <strong>{{ form.name || 'Nome da coleção' }}</strong>
                    <small>{{ form.description || 'Descrição da coleção' }}</small>
                    <em>/{{ form.slug || 'slug-da-colecao' }}</em>
                  </div>
                </article>
              </div>

              <div class="form-actions modal-actions">
                <button class="btn btn-ghost" type="button" @click="closeModal">
                  Cancelar
                </button>

                <button class="btn btn-ember" type="submit" :disabled="saving">
                  {{ saving
                    ? 'Salvando...'
                    : editingId
                      ? 'Salvar coleção'
                      : 'Criar coleção' }}
                </button>
              </div>
            </form>
          </section>
        </div>
      </Transition>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import {
  deleteCategory,
  listCategories,
  saveCategory,
} from '../services/categoriesService'
import { useToast } from '../composables/useToast'

const { push } = useToast()

const categories = ref([])
const editingId = ref(null)
const modalOpen = ref(false)
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  name: '',
  slug: '',
  icon: '',
  description: '',
  is_active: true,
})

const modalTitleId = computed(() =>
  editingId.value ? 'edit-category-title' : 'create-category-title'
)

function slugify(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function syncSlug() {
  if (!editingId.value) {
    form.slug = slugify(form.name)
  }
}

function reset() {
  editingId.value = null

  Object.assign(form, {
    name: '',
    slug: '',
    icon: '',
    description: '',
    is_active: true,
  })
}

function openCreateModal() {
  reset()
  modalOpen.value = true
}

function openEditModal(cat) {
  editingId.value = cat.id

  Object.assign(form, {
    name: cat.name || '',
    slug: cat.slug || '',
    icon: cat.icon || '',
    description: cat.description || '',
    is_active: Boolean(cat.is_active),
  })

  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  reset()
}

function handleKeydown(event) {
  if (event.key === 'Escape' && modalOpen.value) {
    closeModal()
  }
}

async function load() {
  loading.value = true

  try {
    categories.value = await listCategories(true)
  } catch (error) {
    console.error(error)
    push('Não foi possível carregar as coleções.', 'error')
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (saving.value) return

  saving.value = true

  try {
    await saveCategory({ ...form }, editingId.value)

    push(editingId.value ? 'Coleção atualizada.' : 'Coleção criada.')

    closeModal()
    await load()
  } catch (error) {
    console.error(error)
    push('Não foi possível salvar a coleção.', 'error')
  } finally {
    saving.value = false
  }
}

async function remove(cat) {
  const confirmed = confirm(`Excluir coleção "${cat.name}"?`)

  if (!confirmed) return

  try {
    await deleteCategory(cat.id)
    push('Coleção excluída.')
    await load()
  } catch (error) {
    console.error(error)
    push('Não foi possível excluir. Verifique produtos vinculados.', 'error')
  }
}

onMounted(() => {
  load()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.categories-header-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.categories-header-card h2,
.section-title-row h2 {
  margin: 0;
  color: #fff7ea;
}

.categories-header-card p,
.section-title-row p {
  margin: 0.35rem 0 0;
  color: rgba(255, 247, 234, 0.64);
  line-height: 1.55;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.category-list {
  display: grid;
  gap: 0.85rem;
}

.category-admin-card {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr) auto;
  gap: 0.95rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1.1rem;
  background:
    linear-gradient(135deg, rgba(255, 194, 71, 0.05), rgba(255, 90, 31, 0.03)),
    rgba(255, 255, 255, 0.03);
}

.category-admin-card.inactive {
  opacity: 0.68;
}

.category-admin-card i {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 194, 71, 0.26);
  border-radius: 1rem;
  background: rgba(255, 194, 71, 0.08);
  font-size: 1.35rem;
  font-style: normal;
}

.category-info {
  min-width: 0;
}

.category-title-line {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  flex-wrap: wrap;
}

.category-title-line h3 {
  margin: 0;
  color: #fff7ea;
  line-height: 1.15;
}

.category-info p {
  margin: 0.35rem 0;
  color: rgba(255, 247, 234, 0.6);
  line-height: 1.45;
}

.category-slug {
  color: rgba(255, 194, 71, 0.82);
  font-size: 0.82rem;
  font-weight: 800;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 1.55rem;
  padding: 0.22rem 0.55rem;
  border: 1px solid rgba(239, 68, 68, 0.34);
  border-radius: 999px;
  color: #fecaca;
  background: rgba(239, 68, 68, 0.12);
  font-size: 0.72rem;
  font-weight: 900;
}

.status-pill.active {
  border-color: rgba(34, 197, 94, 0.34);
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.12);
}

.row-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.empty-admin-state {
  display: grid;
  justify-items: start;
  gap: 0.65rem;
  padding: 1.2rem;
  border: 1px dashed rgba(255, 194, 71, 0.28);
  border-radius: 1.2rem;
  background: rgba(255, 194, 71, 0.04);
}

.empty-admin-state strong {
  color: #fff7ea;
}

.empty-admin-state p {
  margin: 0;
  color: rgba(255, 247, 234, 0.62);
}

.skeleton-card {
  pointer-events: none;
}

.skeleton-icon,
.skeleton-content span {
  display: block;
  border-radius: 0.7rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.05)
  );
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite linear;
}

.skeleton-icon {
  width: 3rem;
  height: 3rem;
}

.skeleton-content {
  display: grid;
  gap: 0.45rem;
}

.skeleton-content span {
  height: 0.75rem;
}

.skeleton-content span:nth-child(1) {
  width: 160px;
}

.skeleton-content span:nth-child(2) {
  width: 260px;
}

.skeleton-content span:nth-child(3) {
  width: 110px;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

.category-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(12px);
}

.category-modal {
  width: min(760px, 100%);
  max-height: min(88vh, 780px);
  overflow: auto;
  border: 1px solid rgba(255, 194, 71, 0.24);
  border-radius: 1.35rem;
  background:
    radial-gradient(circle at 15% 0%, rgba(255, 90, 31, 0.16), transparent 20rem),
    linear-gradient(180deg, #141416, #09090a);
  box-shadow: 0 30px 110px rgba(0, 0, 0, 0.6);
}

.category-modal-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.category-modal-header h2 {
  margin: 0.2rem 0 0.35rem;
  color: #fff7ea;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
  line-height: 1;
  letter-spacing: -0.05em;
}

.category-modal-header p {
  margin: 0;
  color: rgba(255, 247, 234, 0.62);
  line-height: 1.5;
}

.modal-close {
  width: 2.35rem;
  height: 2.35rem;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  color: #fff7ea;
  background: rgba(255, 255, 255, 0.06);
  font-size: 1.45rem;
  cursor: pointer;
}

.modal-close:hover {
  border-color: rgba(255, 194, 71, 0.42);
  color: #ffc247;
}

.category-form {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.category-form label {
  display: grid;
  gap: 0.45rem;
  color: rgba(255, 247, 234, 0.76);
  font-weight: 800;
  font-size: 0.86rem;
}

.textarea-field {
  resize: vertical;
  min-height: 110px;
}

.modal-preview {
  display: grid;
  gap: 0.55rem;
}

.modal-preview > span {
  color: rgba(255, 247, 234, 0.56);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.category-preview-card {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0.8rem;
  align-items: center;
  padding: 0.85rem;
  border: 1px solid rgba(255, 194, 71, 0.18);
  border-radius: 1rem;
  background: rgba(255, 194, 71, 0.05);
}

.category-preview-card i {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border-radius: 0.85rem;
  background: rgba(255, 194, 71, 0.1);
  font-size: 1.25rem;
  font-style: normal;
}

.category-preview-card strong,
.category-preview-card small,
.category-preview-card em {
  display: block;
}

.category-preview-card strong {
  color: #fff7ea;
}

.category-preview-card small {
  margin-top: 0.18rem;
  color: rgba(255, 247, 234, 0.58);
  line-height: 1.4;
}

.category-preview-card em {
  margin-top: 0.2rem;
  color: rgba(255, 194, 71, 0.82);
  font-style: normal;
  font-size: 0.78rem;
  font-weight: 800;
}

.modal-actions {
  justify-content: flex-end;
  padding-top: 0.25rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 740px) {
  .categories-header-card {
    align-items: stretch;
    flex-direction: column;
  }

  .categories-header-card .btn {
    width: 100%;
    justify-content: center;
  }

  .category-admin-card {
    grid-template-columns: 2.8rem minmax(0, 1fr);
  }

  .row-actions {
    grid-column: 1 / -1;
    justify-content: stretch;
  }

  .row-actions .btn {
    flex: 1;
  }

  .category-modal-backdrop {
    align-items: end;
    padding: 0;
  }

  .category-modal {
    width: 100%;
    max-height: 92vh;
    border-radius: 1.25rem 1.25rem 0 0;
  }

  .category-modal-header,
  .category-form {
    padding-inline: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .modal-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>