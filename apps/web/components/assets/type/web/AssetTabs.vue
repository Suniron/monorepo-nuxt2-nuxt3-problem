<script>
import AssetVulnerabilities from '~/components/assets/details/vulnerabilities'
import AssetSitemap from '~/components/assets/details/sitemap'
import AssetDetailsForm from '~/components/assets/details/asset-details.vue'
import AssetRelationsList from '~/components/assets/details/AssetRelationsList.vue'

export default {
  components: {
    AssetDetailsForm,
    AssetRelationsList,
    AssetSitemap,
    AssetVulnerabilities,
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
      <v-tab>Vulnerabilities</v-tab>
      <v-tab v-if="asset.sitemap">
        SiteMap
      </v-tab>
      <v-tab>Details</v-tab>
      <v-tab>Networks</v-tab>
      <v-tab>Business units</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="px-5">
      <v-tab-item>
        <AssetVulnerabilities :asset="asset" />
      </v-tab-item>
      <v-tab-item v-if="asset.sitemap">
        <AssetSitemap :sitemap="asset.sitemap" />
      </v-tab-item>
      <v-tab-item>
        <AssetDetailsForm :asset="asset" />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList :asset="asset" parents :types="['NETWORK']" />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList :asset="asset" parents :types="['UNIT']" />
      </v-tab-item>
    </v-tabs-items>
  </v-col>
</template>
