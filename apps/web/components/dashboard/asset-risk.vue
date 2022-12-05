<template>
  <v-card class="d-flex flex-column">
    <v-card-title
      >Asset Security Level Summary<v-spacer></v-spacer
      ><v-icon @click="$emit('close')">mdi-close</v-icon></v-card-title
    >
    <v-card-text class="dash-text d-flex overflow-y-auto">
      <pie-chart id="assetrisk" :data="chartData" :config="chartConfig" />
    </v-card-text>
  </v-card>
</template>

<script>
import PieChart from '~/components/charts/pie-chart'
import { severityColor } from '~/utils/color.utils'

export default {
  name: 'RiskAssetSummary',
  components: {
    PieChart
  },
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
        value: 1,
        color: severityColor('CRITICAL')
      },
      high: {
        value: 1,
        color: severityColor('HIGH')
      },
      medium: {
        value: 1,
        color: severityColor('MEDIUM')
      },
      low: {
        value: 1,
        color: severityColor('LOW')
      },
      stateOfTheArt: {
        value: 1,
        color: severityColor('STATE_OF_THE_ART')
      }
    }
  }),
  watch: {
    data(newSeverities) {
      this.populateChartData(newSeverities)
    }
  },
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
    }
  }
}
</script>

<style></style>
