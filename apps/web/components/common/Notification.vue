<script setup lang="ts">
// TODO: add notification queue
// TODO: add close button in top right corner or close on click

import { onMounted, ref } from 'vue'

const props = defineProps<{
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  /**
   * Timeout to auto close notification. Default to **5000ms**.
   */
  timeout?: number
}>()
const emits = defineEmits(['close'])

const show = ref(true)

onMounted(() => {
  setTimeout(() => {
    show.value = false
    emits('close')
  }, props.timeout ?? 5000)
})
</script>

<template>
  <div v-if="show" class="toast toast-center z-50">
    <div
      class="alert shadow-lg w-max max-w-lg"
      :class="`alert-${props.type}`"
    >
      <div>
        <span class="font-semibold">
          {{ props.message }}
        </span>
      </div>
    </div>
  </div>
</template>
