<template>
  <v-data-iterator :items="scans" item-key="id" hide-default-footer>
    <template #default="{ items }">
      <v-sheet v-for="item of items" :key="item.id" class="mt-4 pa-4" rounded>
        <v-container>
          <v-row align="center">
            <v-col cols="8">
              <nuxt-link
                :to="`/scans/${item.id}`"
                class="font-weight-bold text-break ma-0"
              >
                {{ item.name ? item.name : 'Scan' }}
              </nuxt-link>
            </v-col>
            <v-col cols="4">
              <div
                v-if="item.startDate && item.startTime"
                class="d-flex justify-end"
              >
                {{ item.startDate + ' ' + item.startTime }}
                <v-icon class="ml-1">mdi-calendar-clock</v-icon>
              </div>
            </v-col>
            <v-col cols="12" lg="2">
              <small
                >created: {{ formatDate(item.createdAt) }}<br />Duration:
                {{ duration(item.completedAt, item.startedAt) }}<br />Probe:
                {{ item.probeName || 'NA' }}
              </small>
            </v-col>
            <v-col cols="12" lg="10">
              <v-stepper class="scan">
                <v-stepper-header>
                  <v-stepper-step
                    :complete="
                      scanStates[item.status.toLowerCase()] >= scanStates.new
                    "
                    step=""
                  >
                    New
                    <small
                      v-if="
                        scanStates[item.status.toLowerCase()] >= scanStates.new
                      "
                      >{{ formatDate(item.createdAt) }}</small
                    >
                  </v-stepper-step>
                  <v-divider />
                  <v-stepper-step
                    :complete="
                      scanStates[item.status.toLowerCase()] >=
                        scanStates.created
                    "
                    step=""
                  >
                    Created
                  </v-stepper-step>
                  <v-divider />

                  <v-stepper-step
                    v-if="whatStatus[item.status.toLowerCase()]"
                    :complete="
                      scanStates[item.status.toLowerCase()] >=
                        scanStates.running
                    "
                    step=""
                  >
                    {{ whatStatus[item.status.toLowerCase()] }}
                  </v-stepper-step>
                  <v-stepper-step
                    v-else
                    :complete="
                      scanStates[item.status.toLowerCase()] >=
                        scanStates.running
                    "
                    step=""
                  >
                    Running
                  </v-stepper-step>
                  <v-divider />
                  <v-stepper-step
                    v-if="
                      item.status.toLowerCase() === 'completed and processed'
                    "
                    :complete="
                      scanStates[item.status.toLowerCase()] >=
                        scanStates.completed
                    "
                    step=""
                  >
                    Completed and Processed
                    <small v-if="item.completedAt">{{
                      formatDate(item.completedAt)
                    }}</small>
                  </v-stepper-step>
                  <v-stepper-step
                    v-else
                    :complete="
                      scanStates[item.status.toLowerCase()] >=
                        scanStates.completed
                    "
                    step=""
                  >
                    Completed
                  </v-stepper-step>
                </v-stepper-header>
              </v-stepper>
            </v-col>
          </v-row>
          <v-card class="mt-2">
            <v-card-text>
              <v-row>
                <v-col cols="12" lg="2">
                  Vulnerabilities discovered:
                </v-col>
                <v-col cols="12" lg="1"></v-col>
                <v-col cols="12" lg="2" class="crit">
                  Critical: {{ item.crit }}
                </v-col>
                <v-col cols="12" lg="2" class="high">
                  High: {{ item.high }}
                </v-col>
                <v-col cols="12" lg="2" class="medium">
                  Medium: {{ item.medium }}
                </v-col>
                <v-col cols="12" lg="2" class="low">
                  Low: {{ item.low }}
                </v-col>
              </v-row>
              <v-row class="mt-2">
                <v-col cols="12" lg="2">
                  Asset discovered:
                </v-col>
                <v-col cols="12" lg="10">
                  <v-responsive class="overflow-y-auto" max-height="75">
                    <v-tooltip top v-for="(asset, i) in item.assets" :key="i">
                      <template #activator="{ on, attrs }">
                        <v-chip
                          v-bind="attrs"
                          v-on="on"
                          style="margin: 2px;"
                          nuxt
                          :to="'/assets/' + asset.id"
                          ><AssetIcon :os="asset.os" :size="20" />&nbsp;{{
                            asset.name
                          }}</v-chip
                        >
                      </template>
                      <AssetDiscoveredTooltip :asset="asset" />
                    </v-tooltip>
                  </v-responsive>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <div class="scan-actions ma-5 d-flex justify-end">
            <v-btn
              color="secondary"
              :disabled="
                item.status.toLowerCase() === 'todelete' ||
                  scanStates[item.status.toLowerCase()] >= scanStates.completed
              "
              @click="
                updateScan(
                  item.id,
                  ['topause', 'paused'].includes(item.status.toLowerCase())
                    ? 'ToResume'
                    : 'ToPause'
                )
              "
              :loading="isLoading"
              >{{
                ['topause', 'paused'].includes(item.status.toLowerCase())
                  ? 'Resume'
                  : 'Stop'
              }}
              Scan</v-btn
            >
            <v-btn
              color="secondary"
              @click="updateScanDialog(item.id)"
              :disabled="item.status.toLowerCase() === 'todelete'"
              :loading="isLoading"
              >Delete Scan</v-btn
            >
            <v-btn
              color="primary"
              @click="downloadReport(item.id)"
              :disabled="
                scanStates[item.status.toLowerCase()] < scanStates.completed
              "
              :loading="isLoading || generatingReport[item.id]"
              >Download report</v-btn
            >
            <nuxt-link
              :to="`/scans/${item.id}`"
              class="font-weight-bold text-break ma-0"
            >
              <v-btn color="primary"> Details</v-btn>
            </nuxt-link>
          </div>
          <!-- Tab focus will return to the first child of the dialog by default -->
          <v-dialog
            :retain-focus="false"
            v-model="isDeleteDialogOpen[item.id]"
            width="500"
          >
            <template #default>
              <v-card>
                <v-card-title>Delete Scan</v-card-title>
                <v-card-text
                  ><p>
                    Are you sure you want to delete this scan ?
                  </p></v-card-text
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="$set(isDeleteDialogOpen, item.id, false)"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="updateScan(scanToDelete, 'ToDelete')"
                  >
                    Delete element
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-container>
      </v-sheet>
    </template>
  </v-data-iterator>
</template>

<script>
import AssetIcon from '~/components/assets/AssetIcon.vue'
import AssetDiscoveredTooltip from '~/components/scans/AssetDiscoveredTooltip.vue'
import { downloadReportFile, updateScanService } from '~/services/scans'

export default {
  name: 'ScansListing',
  components: { AssetIcon, AssetDiscoveredTooltip },
  props: {
    scans: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scanStates: {
        new: 0,
        created: 1,
        started: 2,
        running: 2,
        processing: 2,
        paused: 2,
        topause: 2,
        todelete: 2,
        toresume: 2,
        disconnected: 2,
        completed: 3,
        'completed and processed': 3
      },
      whatStatus: {
        paused: 'Paused',
        topause: 'Pausing',
        todelete: 'Deleting',
        toresume: 'Resuming',
        disconnected: 'Disconnected'
      },
      isLoading: false,
      isDeleteDialogOpen: {},
      scanToDelete: null,
      generatingReport: {}
    }
  },
  methods: {
    formatDate(date) {
      const newDate = new Date(date)
      return newDate.toLocaleString('en-SG')
    },
    duration(d1, d2) {
      if (d1 && d2) {
        let res = ''
        const d1Date = new Date(d1)
        const d2Date = new Date(d2)
        const diffTime = d1Date - d2Date
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays === 1) res += diffDays + ' day '
        else if (diffDays > 1) res += diffDays + ' days '
        const diffHours =
          Math.floor(diffTime / (1000 * 60 * 60)) - 24 * diffDays
        if (diffHours !== 0) res += diffHours + ' h '
        const diffMinutes =
          Math.floor(diffTime / (1000 * 60)) -
          60 * 24 * diffDays -
          60 * diffHours
        if (diffMinutes !== 0) res += diffMinutes + ' m'
        return res
      } else return 'NA'
    },
    updateScanDialog(id) {
      this.scanToDelete = id
      this.$set(this.isDeleteDialogOpen, id, true)
    },
    async updateScan(id, status) {
      await updateScanService(this.$axios, id, { status })
      if (status === 'ToDelete') {
        this.$set(this.isDeleteDialogOpen, id, false)
        this.scanToDelete = null
      }
      this.$emit('change')
    },
    async downloadReport(id) {
      this.$set(this.generatingReport, id, true)
      const { fileName, file } = await downloadReportFile(this.$axios, id)
      const url = window.URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      this.$set(this.generatingReport, id, false)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-actions {
  button {
    margin-left: 10px;
  }
}
.crit {
  background-color: #941e1e;
  color: white;
  text-align: center;
}
.high {
  background-color: #d92b2b;
  color: white;
  text-align: center;
}
.medium {
  background-color: #ed9b0e;
  color: white;
  text-align: center;
}
.low {
  background-color: #f0d802;
  color: white;
  text-align: center;
}
</style>
