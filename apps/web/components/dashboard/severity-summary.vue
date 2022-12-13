<script>
import PieChart from '~/components/charts/pie-chart'
import { severityColor } from '~/utils/color.utils'

export default {
  components: {
    PieChart
  },
  name: 'SeveritySummary',
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
      }
    },
  }),
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
  watch: {
    data(newSeverities) {
      this.populateChartData(newSeverities)
    },
  },
  methods: {
    handleChartClicked({ data }) {
      this.$router.push({
        path: this.localePath('assets'),
        query: {
          severities: data.id,
          types: 'SERVER,WEB,USER,BUILDING',
        },
      })
    },
    populateChartData(severities) {
      this.chartData.low.value = severities.low
      this.chartData.medium.value = severities.medium
      this.chartData.high.value = severities.high
      this.chartData.critical.value = severities.critical
    },
  },
}
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title>
      Severity Summary<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text d-flex overflow-y-auto">
      <PieChart
        id="severity"
        :data="chartData"
        :config="chartConfig"
        @click="handleChartClicked"
      />
    </v-card-text>
  </v-card>
</template>

<style></style>
