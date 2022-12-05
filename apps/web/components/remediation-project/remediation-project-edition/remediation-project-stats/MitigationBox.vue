<template>
  <v-card height="100%">
    <v-card-title>Mitigation of..</v-card-title>
    <v-card-text class="text-center pt-6">
      <p class="text-h4">
        <span class="primary--text">{{ projectVulnerabilityCount }}</span>
        vulnerabilities
      </p>
      <p class="text-h5">among</p>
      <p class="text-h4">
        <span class="primary--text">{{ projectAssetCount }}</span>
        assets
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  computed: {
    /**
     * @returns {number}
     */
    projectVulnerabilityCount() {
      return this.$store.getters[
        'remediationProject/getProjectDetailsVulnerabilityCount'
      ]
    },
    /**
     * @returns {number}
     */
    projectAssetCount() {
      return this.$store.getters[
        'remediationProject/getProjectDetailsAssetCount'
      ]
    }
  }
}
</script>
