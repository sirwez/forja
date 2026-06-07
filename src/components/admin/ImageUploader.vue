<template>
  <div class="upload-box">
    <label class="upload-drop">
      <input type="file" :multiple="multiple" accept="image/png,image/jpeg,image/webp" @change="onChange" />
      <span>{{ uploading ? 'Enviando...' : label }}</span>
      <small>JPG, PNG ou WebP até 6MB</small>
    </label>
    <div v-if="previews.length" class="preview-grid">
      <div v-for="(url, index) in previews" :key="url" class="preview-card">
        <img :src="url" alt="Preview" />
        <button type="button" class="icon-btn danger" @click="remove(index)">×</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { uploadProductImage } from '../../services/uploadService'
import { useToast } from '../../composables/useToast'
const props = defineProps({ modelValue: [String, Array], multiple: Boolean, label: { type: String, default: 'Selecionar imagem' } })
const emit = defineEmits(['update:modelValue'])
const { push } = useToast()
const uploading = ref(false)
const previews = ref([])
watch(() => props.modelValue, (value) => { previews.value = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [] }, { immediate: true })
async function onChange(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return
  uploading.value = true
  try {
    const urls = []
    for (const file of files) urls.push(await uploadProductImage(file))
    if (props.multiple) emit('update:modelValue', [...previews.value, ...urls])
    else emit('update:modelValue', urls[0])
    push('Imagem enviada com sucesso.')
  } catch (error) { push(error.message || 'Erro ao enviar imagem.', 'error') }
  finally { uploading.value = false; event.target.value = '' }
}
function remove(index) {
  const next = previews.value.filter((_, i) => i !== index)
  emit('update:modelValue', props.multiple ? next : '')
}
</script>
