<script setup lang="ts">
// TODO: find best way to map v-model between parent and child component
const props = defineProps<{ placeholder?: string; value: string }>()
const emits = defineEmits(['update:value'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:value', target.value)
}
</script>

<template>
  <input :value="value" class="input input-secondary border-2 border-primary border-solid" :placeholder="props.placeholder" @input="handleInput">
</template>
