import { reactive } from 'vue'

const state = reactive({ items: [] })

export function useToast() {
  function push(message, type = 'success') {
    const id = Date.now() + Math.random()
    state.items.push({ id, message, type })
    window.setTimeout(() => {
      const index = state.items.findIndex((item) => item.id === id)
      if (index >= 0) state.items.splice(index, 1)
    }, 3400)
  }
  return { state, push }
}
