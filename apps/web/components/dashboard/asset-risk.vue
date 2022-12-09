<script>
import PieChart from '~/components/charts/pie-chart'
import { severityColor } from '~/utils/color.utils'

export default {
  components: {
    PieChart
  },
  name: 'RiskAssetSummary',
  props: {
    data: {
      type: Object,
      default: () => ({
        emergency: 0,
        low: 0,
        medium: 0,
        high: 0,
        stateOfTheArt: 0
      })
    }
  },
  data: () => ({
    chartData: {
      emergency: {
        color: severityColor('CRITICAL'),
        value: 1
      },
      high: {
        color: severityColor('HIGH'),
        value: 1
      },
      low: {
        value: 1,
        color: severityColor('LOW')
      },
      medium: {
        value: 1,
        color: severityColor('MEDIUM')
      },
      stateOfTheArt: {
        color: severityColor('STATE_OF_THE_ART'),
        value: 1
      },
    }
  }),
  created() {
    // Non-reactive data
    this.chartConfig = {
      pie: {
        label: {
          format(value) {
            return value
          }
        }
      },
      tooltip: {
        format: {
          value(val) {
            return val
          }
        }
      },
      legend: {
        position: 'right'
      }
    }

    this.populateChartData(this.data)
  },
  watch: {
    data(newSeverities) {
      this.populateChartData(newSeverities)
    },
  },
  methods: {
    /* handleChartClicked({ data }) {
      this.$router.push({
        path: this.localePath('assets'),
        query: {
          risks: data.id
        }
      })
    }, */
    populateChartData(risks) {
      this.chartData.low.value = risks.low
      this.chartData.medium.value = risks.medium
      this.chartData.high.value = risks.high
      this.chartData.emergency.value = risks.emergency
      this.chartData.stateOfTheArt.value = risks.stateOfTheArt
    },
  },
}
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title>
      Asset Security Level Summary<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text d-flex overflow-y-auto">
      <PieChart id="assetrisk" :data="chartData" :config="chartConfig" />
    </v-card-text>
  </v-card>
</template>

<style></style>
