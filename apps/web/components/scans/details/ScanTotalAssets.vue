<template>
  <v-card height="100%">
    <v-card-text class="text-center pt-6">
      <p class="text-h4">
        <span class="primary--text">{{ totalVulns }}</span>
        vulnerabilities found
      </p>
      <p class="text-h5">among</p>
      <p class="text-h4">
        <span class="primary--text">{{ total }}</span>
        scanned assets
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0
    },
    totalVulns: {
      type: Number,
      default: 0
    }
  }
}
</script>
