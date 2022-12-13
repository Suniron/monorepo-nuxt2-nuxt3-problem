<script>
// @ts-check
import { mapActions, mapState } from 'vuex'
import GaugeChart from '~/components/charts/gauge-chart.vue'
import { ASSET_TYPES, TECHNICAL_ASSET_TYPES } from '~/utils/asset.utils'

export default {
  components: {
    GaugeChart,
  },
  computed: {
    ...mapState('assets', ['assetSummary']),

    /**
     * @returns {Object}
     */
    gaugeConfig() {
      const totalTechnicalAssets = TECHNICAL_ASSET_TYPES.reduce(
        (acc, type) => acc + this.assetSummary[type],
        0,
      )
      return {
        color: {
          pattern: ['#45aeb3', '#f9ac7c', '#236c4e'],
        },
        gauge: {
          label: {
            extents: (value, isMax) => {
              return isMax ? value : ''
            },
            format: (value) => {
              return value
            },
          },
          max: totalTechnicalAssets,
        },
        legend: {
          item: {
            tile: {
              height: 15,
              type: 'rectangle',
              width: 15,
            },
          },
        },
        units: 'assets',
      }
    },

    /**
     * @returns {{[assetType: string]: {value: number, label: string}}}
     */
    gaugeData() {
      return TECHNICAL_ASSET_TYPES.slice()
        .sort(
          (type1, type2) => this.assetSummary[type2] - this.assetSummary[type1],
        )
        .reduce((acc, type) => {
          const assetType = ASSET_TYPES.find(t => t.type === type)
          acc[assetType.text] = { value: this.assetSummary[type] }
          return acc
        }, {})
    },
  },
  created() {
    this.updateAssetSummary(this.$axios)
  },
  methods: {
    ...mapActions('assets', ['updateAssetSummary']),
    chartClick(event) {
      const assetTypeString = event.data.name
      const assetType = ASSET_TYPES.find(t => t.text === assetTypeString)
      this.$router.push({
        path: '/assets',
        query: {
          types: assetType.type,
        },
      })
    },
  },
}
</script>

<template>
  <v-card class="mx-auto d-flex flex-column">
    <v-card-title>
      Assets count<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text justify-center d-flex overflow-y-auto">
      <GaugeChart
        id="assetCountGauge"
        :config="gaugeConfig"
        :data="gaugeData"
        @click="chartClick"
      />
    </v-card-text>
  </v-card>
</template>

<style>
#assetCountGauge .bb-shape.bb-arc {
  cursor: pointer;
}
</style>
