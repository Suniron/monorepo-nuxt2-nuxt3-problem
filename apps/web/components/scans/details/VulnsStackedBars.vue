<template>
  <div class="vulns-stacked-bar" :id="chartId"></div>
</template>

<script>
import { bb, bar } from 'billboard.js'
import { severityColor } from '~/utils/color.utils'

const SEVERITY_BACKGROUNDS = {
  critical: '#ffffff',
  high: '#ffffff',
  medium: '#000000',
  low: '#000000'
}

export default {
  props: {
    assetWithVuln: {
      type: Object,
      required: true
    },
    maxVulns: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chartId: `vulns-stacked-bar-${Math.round(Math.random() * 1e10)}`,
      chart: null
    }
  },
  computed: {
    /**
     * @returns {Object}
     */
    chartData() {
      return [
        ['critical', this.assetWithVuln.vulnerabilities.critical ?? 0],
        ['high', this.assetWithVuln.vulnerabilities.high ?? 0],
        ['medium', this.assetWithVuln.vulnerabilities.medium ?? 0],
        ['low', this.assetWithVuln.vulnerabilities.low ?? 0]
      ]
    }
  },
  watch: {
    assetWithVuln: {
      handler() {
        this.chart.load({
          columns: this.chartData,
          done: () => {
            this.chart.resize()
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    // Generate bar chart aggregating the missions severities
    this.chart = bb.generate({
      bindto: `#${this.chartId}`,
      size: {
        height: 50
      },
      axis: {
        x: {
          show: false
        },
        y: {
          show: false,
          max: this.maxVulns
        },
        rotated: true
      },
      legend: {
        show: false
      },
      tooltip: {
        order: '', // Show values in order it was inserted from the data
        linked: true,
        position: (data, width, height, element, { x, y }) => {
          const { top, left } = element.getBoundingClientRect()
          return { top: top + y, left: left + x }
        },
        format: {
          title: () => {
            return `Vulnerabilities for ${this.assetWithVuln.asset_name}`
          },
          name: (name) => {
            // Capitalize word
            return name.charAt(0).toUpperCase() + name.slice(1)
          }
        }
      },
      data: {
        order: null,
        labels: {
          centered: true,
          colors: (_, { value, id }) =>
            value ? SEVERITY_BACKGROUNDS[id] : '#00000000' // transparent label when 0
        },
        columns: this.chartData,
        groups: [this.chartData.map((assetWithVuln) => assetWithVuln[0])],
        xSort: false,
        type: bar(),
        colors: {
          critical: severityColor('CRITICAL'),
          high: severityColor('HIGH'),
          medium: severityColor('MEDIUM'),
          low: severityColor('LOW')
        }
      },
      bar: {
        width: 25,
        label: {
          threshold: 0.01 // Avoid showing values on very small bars
        },
        sensitivity: 10 // Showing the tooltip when the cursor is on the chart (and not just on the bar)
      },

      grid: {
        y: {
          lines: [
            {
              value: 0
            }
          ]
        }
      }
    })
  }
}
</script>

<style lang="scss">
.vulns-stacked-bar .bb-tooltip-container {
  position: fixed !important;
}
</style>
