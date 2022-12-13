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
  components: {
    PieChart
  },
  name: 'ProjectsByStatus',
  computed: {
    ...mapState({
      /**
       * @returns {RemediationProjectSummary[]}
       */
      remediationProjects: state =>
        state.remediationProject.remediationProjects,
    }),

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
              color: statusColor(status),
              value: this.remediationProjects.filter(
                rp => rp.status === status,
              ).length,
            },
          ]
        }),
      )
    },

    /**
     * @returns {StatusCodeTranslation}
     */
    statusCodeTranslation() {
      return {
        canceled: this.$t('projectManagement.statusLevel.canceled'),
        completed: this.$t('projectManagement.statusLevel.completed'),
        in_progress: this.$t('projectManagement.statusLevel.in_progress'),
        open: this.$t('projectManagement.statusLevel.open'),
        overdue: this.$t('projectManagement.statusLevel.overdue'),
        to_review: this.$t('projectManagement.statusLevel.to_review'),
      }
    },
  },
  created() {
    // Non-reactive data
    this.chartConfig = {
      legend: {
        position: 'right',
      },
      pie: {
        label: {
          /**
           * @param {string} value
           */
          format(value) {
            return value
          },
        },
      },
      tooltip: {
        format: {
          /**
           * @param {string} value
           */
          value(value) {
            return value
          },
        },
      },
    }
  },
  data() {
    return {
      chartConfig: {},
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
    },
  },
}
</script>

<template>
  <v-card height="200px" class="d-flex align-center">
    <v-card-text
      v-if="remediationProjects.length === 0"
      class="text-center text-body-1"
    >
      {{ $t('projectManagement.noProject') }}
    </v-card-text>
    <PieChart
      v-else
      id="status"
      :data="chartData"
      :config="chartConfig"
      @click="handleChartClicked"
    />
  </v-card>
</template>
