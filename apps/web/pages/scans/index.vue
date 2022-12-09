<script>
import StackedBarChart from '~/components/charts/stacked-bar-chart'
import ScansListing from '~/components/scans/scans-listing'
import ScanImport from '~/components/controls/scan-import.vue'
import {
  getScansChartDataService,
  getScansListDataService,
} from '~/services/scans'

export default {
  components: { ScansListing, StackedBarChart, ScanImport },
  name: 'ScansPage',
  middleware: ['auth'],
  data: () => ({
    page: 1,
    totalPage: 0,
    dialog: false,
    pageSize: 10,
    chartData: {
      x: {
        value: []
      },
      low: {
        value: [],
        color: '#f0d802'
      },
      medium: {
        value: [],
        color: '#ed9b0e'
      },
      high: {
        value: [],
        color: '#d92b2b'
      },
      critical: {
        value: [],
        color: '#941e1e'
      }
    },
    scans: [],
    chartConfig: {
      data: {
        order: (a, b) => {
          const orders = {
            low: 0,
            medium: 1,
            high: 2,
            critical: 3
          }

          return orders[a.id] - orders[b.id]
        },
        x: 'x'
      },
    }
  }),
  computed: {
    getTotalNumberOfPagination() {
      return Math.ceil(this.totalPage / this.pageSize)
    },
    hasChartData() {
      return Object.values(this.chartData).every(group => group.value.length)
    },
  },
  async created() {
    this.$store.dispatch('changePageTitle', 'Scans')
    await Promise.all([this.fetchScansChartData(), this.fetchScansListing()])
  },
  methods: {
    async dataChange() {
      await this.fetchScansChartData()
      await this.fetchScansListing()
    },
    async fetchScansChartData() {
      const scans = await getScansChartDataService(this.$axios)

      this.chartData = scans.scanHistory.reduce(
        (data, scan) => {
          const date = new Date(scan.sdate)
          const dateString = date.toISOString().split('T')[0]
          data.x.value.push(dateString)
          data.low.value.push(scan.low)
          data.medium.value.push(scan.medium)
          data.high.value.push(scan.high)
          data.critical.value.push(scan.critical)
          return data
        },
        {
          critical: {
            color: '#941e1e',
            value: [],
          },
          high: {
            color: '#d92b2b',
            value: [],
          },
          low: {
            color: '#f0d802',
            value: [],
          },
          medium: {
            color: '#ed9b0e',
            value: [],
          },
          x: {
            value: [],
          },
        },
      )
    },
    async fetchScansListing() {
      const queryParams = {
        page: this.page,
        pageSize: this.pageSize,
      }
      const { scans, total } = await getScansListDataService(
        this.$axios,
        queryParams,
      )
      this.totalPage = total
      this.scans = scans
    },
  },
}
</script>

<template>
  <v-container>
    <StackedBarChart
      v-if="hasChartData"
      id="scans-history"
      :data="chartData"
      :config="chartConfig"
    />

    <div class="mt-8 mb-4 text-right">
      <v-dialog v-model="dialog" width="1200">
        <template #activator="{ on, attrs }">
          <v-btn color="primary" class="mr-4" v-bind="attrs" v-on="on">
            Import Scan
          </v-btn>
        </template>
        <ScanImport @close="dialog = false" @change="dataChange" />
      </v-dialog>
      <nuxt-link :to="localePath('scans-schedule')">
        <v-btn color="primary" dark>
          + Schedule scan
        </v-btn>
      </nuxt-link>
    </div>

    <ScansListing :scans="scans" @change="dataChange" />
    <v-container class="max-width">
      <v-pagination
        v-if="getTotalNumberOfPagination >= 1"
        v-model="page"
        class="my-4"
        :length="getTotalNumberOfPagination"
        @next="fetchScansListing()"
        @previous="fetchScansListing()"
        @input="fetchScansListing()"
      />
    </v-container>
  </v-container>
</template>
