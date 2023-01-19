<script setup lang="ts">
const handleClick = () => {
  console.log("Clicked")
}
</script>

<template>
  <button style="background-color: blueviolet;" @click="handleClick">
  <slot />
  </button>
</template>
