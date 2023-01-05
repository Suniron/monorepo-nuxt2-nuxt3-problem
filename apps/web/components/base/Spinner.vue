<script setup lang="ts">
const props = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
}>()
</script>

<template>
  <div
    class="border-primary border-dashed border-2 rounded-full animate-spin  w-6 h-6"
    :class="{
      'w-4 h-4': props.size === 'sm',
      'w-6 h-6': props.size === 'md',
      'w-8 h-8': props.size === 'lg',
      'w-10 h-10': props.size === 'xl',
      'w-12 h-12': props.size === '2xl',
      'w-14 h-14': props.size === '3xl',
      'w-16 h-16': props.size === '4xl',
      'w-18 h-18': props.size === '5xl',
      'w-20 h-20': props.size === '6xl',
    }"
  />
</template>
