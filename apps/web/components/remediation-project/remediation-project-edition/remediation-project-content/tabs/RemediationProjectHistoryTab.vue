<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-card>
        <v-card-title>Project history</v-card-title>
        <v-card-text class="justify-content-center">
          <v-row justify="center">
            <v-col cols="7">
              <v-alert
                v-if="!statusHistorySortedByDate.length"
                elevation="2"
                type="info"
              >
                There is no history for this project for now.
              </v-alert>

              <v-timeline v-else dense>
                <v-timeline-item
                  v-for="(statusHistory,
                  statusHistoryIndex) in statusHistorySortedByDate"
                  :key="statusHistoryIndex"
                >
                  <v-card class="elevation-2" style="max-width: 400px">
                    <v-card-text class="pb-1">
                      <div class="d-flex justify-space-between">
                        <span>
                          <b>{{ statusHistory.user_name }}</b>
                          {{
                            statusHistory.from_status_name
                              ? 'has updated the status'
                              : 'has started the project'
                          }}
                        </span>

                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on"
                              >{{
                                getDuration(statusHistory.from_date)
                              }}
                              ago</span
                            >
                          </template>
                          <span>{{
                            getFormattedDate(statusHistory.from_date)
                          }}</span>
                        </v-tooltip>
                      </div>

                      <!-- If first status (on open) -->
                      <p
                        v-if="!statusHistory.from_status_name"
                        class="pt-1 text-uppercase font-weight-bold"
                      >
                        <v-chip
                          label
                          :style="
                            getStatusExtraStyle(statusHistory.to_status_name)
                          "
                          >{{ statusHistory.to_status_name }}</v-chip
                        >
                      </p>

                      <!-- Else, status already openned -->
                      <p v-else class="pt-1 text-uppercase font-weight-bold">
                        <v-chip
                          label
                          :style="
                            getStatusExtraStyle(statusHistory.from_status_name)
                          "
                          >{{ statusHistory.from_status_name }}</v-chip
                        >
                        <v-icon>mdi-arrow-right</v-icon>
                        <v-chip
                          label
                          :style="
                            getStatusExtraStyle(statusHistory.to_status_name)
                          "
                          >{{ statusHistory.to_status_name }}</v-chip
                        >
                      </p>
                    </v-card-text>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectStatusHistory} RemediationProjectStatusHistory
 * @typedef {import('@/types/remediationProject').RemediationProjectStatus} RemediationProjectStatus
 */
import { mapState, mapGetters } from 'vuex'
import { format } from 'date-fns'
import { getDurationFromDate } from '@/utils/date.utils'
import { statusColor } from '~/utils/color.utils'

export default {
  props: {
    /**
     * Add title to the editor
     */
    title: { type: String, default: '' }
  },
  data() {
    return {
      /**
       * @type {RemediationProjectStatusHistory[]} */
      messages: []
    }
  },
  computed: {
    ...mapState('remediationProject', ['projectDetails']),
    ...mapGetters('remediationProject', [
      'getProjectDetailsStatusHistorySortedByDate'
    ]),
    /**
     * @returns {RemediationProjectStatusHistory[]} Messages sorted recent to older
     */
    statusHistorySortedByDate() {
      return this.getProjectDetailsStatusHistorySortedByDate
    }
  },
  methods: {
    /**
     * @param {string} date
     */
    getDuration: (date) => getDurationFromDate(date),
    /**
     * @param {RemediationProjectStatus} status
     */
    getStatusExtraStyle: (status) => {
      const extraStyle = {
        backgroundColor: statusColor(status)
      }

      return extraStyle
    },
    /**
     * Returns date like "1994-04-15 17:05"
     *
     * @param {string} date
     * @returns {string}
     */
    getFormattedDate(date) {
      if (!date) {
        return ''
      }
      return format(new Date(date), 'yyyy-MM-dd HH:mm')
    }
  }
}
</script>
