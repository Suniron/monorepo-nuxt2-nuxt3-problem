<script>
export default {
  props: {
    asset: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <div>
    <div class="my-4">
      <span><strong>Name:</strong><br>{{ asset.name || asset.url }}</span>
    </div>
    <div class="my-4">
      <span><strong>URL:</strong> {{ asset.url || 'NA' }}</span>
    </div>
    <div class="my-4">
      <span><strong>Language:</strong> {{ asset.language || 'NA' }}</span>
    </div>
  </div>
</template>
