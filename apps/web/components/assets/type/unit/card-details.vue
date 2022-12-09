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
      <span><v-icon left>mdi-card-account-details-outline</v-icon><strong>Name:</strong> {{ asset.name }}</span>
    </div>
  </div>
</template>
