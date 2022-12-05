<template>
  <v-col cols="12">
    <v-tabs v-model="tab" show-arrows>
      <!-- <v-tabs-slider color="yellow"></v-tabs-slider> -->
      <v-tab>Vulnerabilities</v-tab>
      <v-tab>Hardening</v-tab>
      <v-tab>Details</v-tab>
      <v-tab>Port</v-tab>
      <v-tab>Networks</v-tab>
      <v-tab>Locations</v-tab>
      <v-tab>Business Units</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="px-5">
      <v-tab-item>
        <asset-vulnerabilities :tabs="tab" :asset="asset" />
      </v-tab-item>
      <v-tab-item>
        <asset-hardening :asset="asset" />
      </v-tab-item>
      <v-tab-item>
        <asset-details-form :asset="asset" />
      </v-tab-item>
      <v-tab-item>
        <asset-port :tabs="tab" :asset-id="asset.id" />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList :asset="asset" parents :types="['NETWORK']" />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList
          :asset="asset"
          parents
          :types="['BUILDING']"
          relation-type="LOCATED_TO"
        />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList :asset="asset" parents :types="['UNIT']" />
      </v-tab-item>
    </v-tabs-items>
  </v-col>
</template>
<script>
import AssetRelationsList from '~/components/assets/details/AssetRelationsList.vue'
import AssetVulnerabilities from '~/components/assets/details/vulnerabilities'
import AssetDetailsForm from '~/components/assets/details/asset-details.vue'
import AssetPort from '~/components/assets/details/asset-ports.vue'
import AssetHardening from '~/components/assets/details/asset-hardening.vue'
// import AssetRelationModalActivator from '~/components/assets/AssetRelationModalActivator.vue'
export default {
  components: {
    AssetVulnerabilities,
    AssetDetailsForm,
    AssetPort,
    AssetHardening,
    AssetRelationsList
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: null
    }
  }
}
</script>
