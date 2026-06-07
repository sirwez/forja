<template>
  <aside class="filters" :class="{ open }">
    <div class="filter-head">
      <h3>Filtros</h3>
      <button v-if="closable" class="icon-btn" @click="$emit('close')">×</button>
    </div>
    <div class="filter-group">
      <label>Categoria</label>
      <select v-model="filters.category" class="field">
        <option value="all">Todas</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.icon }} {{ category.name }}</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Disponibilidade</label>
      <select v-model="filters.type" class="field">
        <option value="all">Todos</option>
        <option value="shopee">Disponível na Shopee</option>
        <option value="custom">Personalizável</option>
        <option value="order">Sob encomenda</option>
        <option value="stock">Pronta entrega</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Raridade</label>
      <select v-model="filters.rarity" class="field">
        <option value="all">Todas</option>
        <option>Comum</option><option>Incomum</option><option>Raro</option><option>Épico</option><option>Lendário</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Tag</label>
      <select v-model="filters.tag" class="field">
        <option value="all">Todas</option>
        <option v-for="tag in tags" :key="tag" :value="tag">#{{ tag }}</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Preço máximo</label>
      <input v-model="filters.maxPrice" class="field" type="number" min="0" placeholder="Ex: 80" />
    </div>
    <button class="btn btn-ghost w-full" @click="reset">Limpar filtros</button>
  </aside>
</template>
<script setup>
defineProps({ filters: Object, categories: Array, tags: Array, open: Boolean, closable: Boolean })
const emit = defineEmits(['reset', 'close'])
function reset() { emit('reset') }
</script>
