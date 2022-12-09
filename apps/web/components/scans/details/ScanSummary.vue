<script>
import { format } from 'date-fns'
import { getTimeInterval } from '~/utils/date.utils'

export default {
  methods: {
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
    },
    getTimeInterval
  },
  props: {
    scanSummary: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <v-card height="100%">
    <v-card-text v-if="!scanSummary">
      <v-alert type="warning">
        Error, scan not found
      </v-alert>
    </v-card-text>

    <v-card-text v-else class="text-body-2">
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">
                {{
                  scanSummary.name
                }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>Type</td>
            <td class="pl-2 font-weight-medium">
              <v-chip label small class="font-weight-medium text-capitalize">
                {{ scanSummary.label || 'Unknown' }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>Creation</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">
                {{
                  getFormattedDate(scanSummary.cdate)
                }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>Duration</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">
                {{
                  getTimeInterval(scanSummary.sdate, scanSummary.fdate)
                }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>Probe</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">
                {{
                  scanSummary.probe
                }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<style></style>
