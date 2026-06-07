<template>
  <div class="spark-layer" aria-hidden="true">
    <span v-for="spark in sparks" :key="spark" :style="sparkStyle(spark)"></span>
  </div>
</template>

<script setup>
const sparks = Array.from({ length: 30 }, (_, index) => index)
function sparkStyle(index) {
  return {
    left: `${(index * 37) % 100}%`,
    animationDelay: `${(index % 9) * 0.55}s`,
    animationDuration: `${4 + (index % 7) * 0.42}s`,
    opacity: 0.35 + (index % 5) * 0.08,
  }
}
</script>
