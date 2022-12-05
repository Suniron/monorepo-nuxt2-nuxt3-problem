<template>
  <div>
    <div class="my-4">
      <span
        ><v-icon left>mdi-card-account-details-outline</v-icon
        ><strong>Name:</strong> {{ asset.name }}</span
      >
    </div>
    <div class="my-4">
      <span
        ><v-icon left>mdi-map-marker-radius</v-icon><strong>location:</strong>
        {{ asset.location || 'NA' }}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  }
}
</script>
