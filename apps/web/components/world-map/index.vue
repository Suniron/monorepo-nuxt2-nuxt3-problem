<script>
// @ts-check
import { LMap, LTileLayer } from 'vue2-leaflet'
import Buildings from './Buildings.vue'
import AssetEditDrawer from '~/components/assets/asset-edit-drawer.vue'

export default {
  components: {
    AssetEditDrawer,
    Buildings,
    LMap,
    LTileLayer,
  },
  computed: {
    /**
     * @returns {boolean}
     */
    isAssetSelected() {
      return this.selectedAssetId !== -1
    }
  },
  data() {
    return {
      center: [30, 0],
      mapLayerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      mapLayerAttribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 3,
      selectedAssetId: -1
    }
  },
  methods: {
    /**
     * @param {number} assetId
     */
    updateSelectedAssetId(assetId) {
      this.selectedAssetId = assetId
    },
  },
}
</script>

<template>
  <v-card>
    <v-card-title>
      Site location
    </v-card-title>

    <v-card-subtitle>
      Click on an asset to show its details
    </v-card-subtitle>

    <v-card-text>
      <ClientOnly>
        <LMap id="map" :zoom="zoom" :center="center">
          <!-- Map image: -->
          <LTileLayer :url="mapLayerUrl" :attribution="mapLayerAttribution" />

          <!-- Map markers: -->
          <Buildings @select-building="updateSelectedAssetId" />
        </LMap>
      </ClientOnly>
    </v-card-text>

    <AssetEditDrawer
      v-if="isAssetSelected"
      :node-selected="isAssetSelected"
      :asset-id="selectedAssetId"
      @close="updateSelectedAssetId(-1)"
    />
  </v-card>
</template>

<style lang="scss" scoped>
#map {
  width: 100%;
  min-height: 600px;
  z-index: 1;
}
</style>
