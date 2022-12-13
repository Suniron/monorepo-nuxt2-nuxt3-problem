<script>
// import AssetVulnerabilities from '~/components/assets/details/vulnerabilities'
import AssetDetailsForm from '~/components/assets/details/asset-details.vue'

export default {
  components: {
    // AssetVulnerabilities,
    AssetDetailsForm,
  },
  data() {
    return {
      tab: null
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <v-col cols="12">
    <v-tabs v-model="tab" show-arrows>
      <!-- <v-tabs-slider color="yellow"></v-tabs-slider> -->
      <!-- <v-tab>Vulnerabilities</v-tab> -->
      <v-tab>Details</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- <v-tab-item>
        <asset-vulnerabilities :asset="asset" />
      </v-tab-item> -->
      <v-tab-item>
        <AssetDetailsForm :asset="asset" />
      </v-tab-item>
    </v-tabs-items>
  </v-col>
</template>
