<template>
  <div class="empty-state">
    <div class="empty-icon">⚒️</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({ title: String, message: String })
</script>
