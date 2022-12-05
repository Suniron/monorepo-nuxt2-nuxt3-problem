<template>
  <span>
    <LMarker
      v-for="ba in buildingAssets"
      :key="ba.id"
      :lat-lng="[ba.latitude, ba.longitude]"
      @click="$emit('select-building', ba.id)"
    >
      <LIcon>
        <v-icon class="buidling-icon" :color="ba.scoreColor" :size="iconSize">
          mdi-office-building-outline
        </v-icon>
      </LIcon>
    </LMarker>
  </span>
</template>

<script>
// @ts-check
import { LMarker, LIcon } from 'vue2-leaflet'
import { getAssetsRisk, searchAssetsService } from '~/services/assets'
import { riskScoreColor, riskScoreLetter } from '~/utils/risk.utils'

export default {
  components: {
    LMarker,
    LIcon
  },
  data() {
    return {
      buildingAssets: [],
      iconSize: 42
    }
  },
  created() {
    this.fetchBuildingAssets()
  },
  methods: {
    /**
     * Note: for now, we are only displaying buildings
     */
    async fetchBuildingAssets() {
      try {
        const { assets } = await searchAssetsService(this.$axios, {
          types: ['BUILDING']
        })

        const buildingAssetsWithLocation = assets.filter(
          (asset) => asset.longitude && asset.latitude
        )

        const buildingAssetsWithLocationAndRisk = await Promise.all(
          buildingAssetsWithLocation.map(async (asset) => {
            const { data: risk } = await getAssetsRisk(this.$axios, asset.id)
            const assetWithRisk = {
              ...asset,
              risk
            }

            // Because "Building" is a super asset, use computed risk score and force scanned to true:
            assetWithRisk.scoreLetter = riskScoreLetter(
              assetWithRisk.risk.computedScore,
              risk.hasVulnerability,
              true
            )
            assetWithRisk.scoreColor = riskScoreColor(
              assetWithRisk.risk.computedScore,
              risk.hasVulnerability,
              true
            )
            return assetWithRisk
          })
        )

        this.buildingAssets = buildingAssetsWithLocationAndRisk
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
builing-icon {
  width: webkit-fill-available;
}
</style>
