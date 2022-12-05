<template>
  <v-card class="d-flex flex-column">
    <v-card-title
      >Severity Summary<v-spacer></v-spacer
      ><v-icon @click="$emit('close')">mdi-close</v-icon></v-card-title
    >
    <v-card-text class="dash-text d-flex overflow-y-auto">
      <pie-chart
        id="severity"
        :data="chartData"
        :config="chartConfig"
        @click="handleChartClicked"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import PieChart from '~/components/charts/pie-chart'
import { severityColor } from '~/utils/color.utils'

export default {
  name: 'SeveritySummary',
  components: {
    PieChart
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      })
    }
  },
  data: () => ({
    chartData: {
      critical: {
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
        },
        order: (a, b) => {
          const orders = {
            low: 0,
            medium: 1,
            high: 2,
            critical: 3
          }
          console.log(a, b)
          return orders[a.id] - orders[b.id]
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
    handleChartClicked({ data }) {
      this.$router.push({
        path: this.localePath('assets'),
        query: {
          severities: data.id,
          types: 'SERVER,WEB,USER,BUILDING'
        }
      })
    },
    populateChartData(severities) {
      this.chartData.low.value = severities.low
      this.chartData.medium.value = severities.medium
      this.chartData.high.value = severities.high
      this.chartData.critical.value = severities.critical
    }
  }
}
</script>

<style></style>
