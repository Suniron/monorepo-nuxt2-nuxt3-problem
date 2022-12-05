<template>
  <v-card height="100%">
    <v-card-text
      class="text-center text-body-1"
      v-if="assetVulnerabilities.length === 0"
      >There is no vulnerabilities</v-card-text
    >
    <pie-chart v-else id="status" :data="chartData" :config="chartConfig" />
  </v-card>
</template>

<script>
import PieChart from '~/components/charts/pie-chart.vue'
import { severityColor } from '~/utils/color.utils'

export default {
  components: {
    PieChart
  },
  props: {
    assetVulnerabilities: {
      type: Array,
      required: true
    }
  },
  data: () => {
    return {
      chartConfig: {},
      severities: ['info', 'low', 'medium', 'high', 'critical'],
      severityEquivalentScore: {
        low: [0, 4],
        medium: [4, 7],
        high: [7, 9],
        critical: [9, 10]
      }
    }
  },
  computed: {
    chartData() {
      return Object.fromEntries(
        this.severities.map((severity) => {
          return [
            severity,
            {
              value: this.assetVulnerabilities.filter((av) => {
                if (av.severity) {
                  return av.severity === severity
                }
                if (this.severityEquivalentScore[severity]) {
                  return (
                    av.cvss_score >=
                      this.severityEquivalentScore[severity][0] &&
                    av.cvss_score < this.severityEquivalentScore[severity][1]
                  )
                }
                return av.cvss_score === null
              }).length,
              color: severityColor(severity.toUpperCase())
            }
          ]
        })
      )
    }
  }
}
</script>
