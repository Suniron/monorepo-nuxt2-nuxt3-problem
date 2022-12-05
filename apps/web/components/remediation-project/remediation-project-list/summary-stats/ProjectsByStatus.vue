<template>
  <v-card height="200px" class="d-flex align-center">
    <v-card-text
      class="text-center text-body-1"
      v-if="remediationProjects.length === 0"
      >{{ $t('projectManagement.noProject') }}</v-card-text
    >
    <pie-chart
      v-else
      id="status"
      :data="chartData"
      :config="chartConfig"
      @click="handleChartClicked"
    />
  </v-card>
</template>

<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectSummary} RemediationProjectSummary
 */

/**
 * Map translation for each project status code
 * @typedef {object} StatusCodeTranslation
 * @property {string} overdue
 * @property {string} canceled
 * @property {string} completed
 * @property {string} to_review
 * @property {string} in_progress
 * @property {string} open
 */

/**
 * Data of the pie chart
 * @typedef {{[status: string]: {value: number, color: string}}} ChartData
 */

import { mapState } from 'vuex'
import PieChart from '~/components/charts/pie-chart.vue'
import { statusColor } from '~/utils/color.utils'

export default {
  name: 'ProjectsByStatus',
  components: {
    PieChart
  },
  data() {
    return {
      chartConfig: {}
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {RemediationProjectSummary[]}
       */
      remediationProjects: (state) =>
        state.remediationProject.remediationProjects
    }),
    /**
     * @returns {StatusCodeTranslation}
     */
    statusCodeTranslation() {
      return {
        overdue: this.$t('projectManagement.statusLevel.overdue'),
        canceled: this.$t('projectManagement.statusLevel.canceled'),
        completed: this.$t('projectManagement.statusLevel.completed'),
        to_review: this.$t('projectManagement.statusLevel.to_review'),
        in_progress: this.$t('projectManagement.statusLevel.in_progress'),
        open: this.$t('projectManagement.statusLevel.open')
      }
    },
    /**
     * Get the chart data
     * @returns {ChartData}
     */
    chartData() {
      return Object.fromEntries(
        Object.keys(this.statusCodeTranslation).map((status) => {
          return [
            this.$t(`projectManagement.statusLevel.${status}`),
            {
              value: this.remediationProjects.filter(
                (rp) => rp.status === status
              ).length,
              color: statusColor(status)
            }
          ]
        })
      )
    }
  },
  created() {
    // Non-reactive data
    this.chartConfig = {
      pie: {
        label: {
          /**
           * @param {string} value
           */
          format(value) {
            return value
          }
        }
      },
      tooltip: {
        format: {
          /**
           * @param {string} value
           */
          value(value) {
            return value
          }
        }
      },
      legend: {
        position: 'right'
      }
    }
  },
  methods: {
    /**
     * @param {Object} event
     */
    handleChartClicked(event) {
      const status = Object.keys(this.statusCodeTranslation).find((key) => {
        return this.statusCodeTranslation[key] === event.data.id
      })
      this.$root.$emit('remediation-project-list:filter-by-status', status)
    }
  }
}
</script>
