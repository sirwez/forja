<template>
  <div class="toast-stack" aria-live="polite">
    <div v-for="item in state.items" :key="item.id" class="toast" :class="item.type">
      {{ item.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast'
const { state } = useToast()
</script>
