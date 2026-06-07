<template>
  <div class="skeleton-grid">
    <div v-for="item in count" :key="item" class="loading-card"></div>
  </div>
</template>
<script setup>
defineProps({ count: { type: Number, default: 3 } })
</script>
