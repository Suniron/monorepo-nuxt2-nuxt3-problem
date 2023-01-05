<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  size?: 'small' | 'medium' | 'large'
  fit?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref(null)
</script>

<template>
  <div
    class="modal modal-open"
    @mousedown="emit('close')"
  >
    <div
      ref="modalRef"
      class="modal-box"
      :class="{
        'w-11/12 max-w-7xl': props.size === 'large',
        'w-9/12 max-w-5xl': props.size === 'medium',
        'w-fit': props.fit,
      }"
      @mousedown.stop=""
      @click.stop=""
    >
      <h2 v-if="props.title" class="text-xl font-semibold">
        {{ props.title }}
      </h2>
      <slot />
    </div>
  </div>
</template>
