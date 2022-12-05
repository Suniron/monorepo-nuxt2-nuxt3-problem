<template>
  <v-container>
    <stacked-bar-chart
      id="scans-history"
      v-if="hasChartData"
      :data="chartData"
      :config="chartConfig"
    />

    <div class="mt-8 mb-4 text-right">
      <v-dialog v-model="dialog" width="1200">
        <template #activator="{ on, attrs }">
          <v-btn color="primary" class="mr-4" v-on="on" v-bind="attrs"
            >Import Scan</v-btn
          >
        </template>
        <scan-import @close="dialog = false" @change="dataChange" />
      </v-dialog>
      <nuxt-link :to="localePath('scans-schedule')">
        <v-btn color="primary" dark>
          + Schedule scan
        </v-btn>
      </nuxt-link>
    </div>

    <scans-listing :scans="scans" @change="dataChange" />
    <v-container class="max-width">
      <v-pagination
        v-if="getTotalNumberOfPagination >= 1"
        v-model="page"
        class="my-4"
        :length="getTotalNumberOfPagination"
        @next="fetchScansListing()"
        @previous="fetchScansListing()"
        @input="fetchScansListing()"
      ></v-pagination>
    </v-container>
  </v-container>
</template>

<script>
import StackedBarChart from '~/components/charts/stacked-bar-chart'
import ScansListing from '~/components/scans/scans-listing'
import ScanImport from '~/components/controls/scan-import.vue'
import {
  getScansChartDataService,
  getScansListDataService
} from '~/services/scans'

export default {
  name: 'ScansPage',
  components: { ScansListing, StackedBarChart, ScanImport },
  middleware: ['auth'],
  data: () => ({
    totalPage: 0,
    page: 1,
    pageSize: 10,
    dialog: false,
    scans: [],
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
    chartConfig: {
      data: {
        x: 'x',
        order: (a, b) => {
          const orders = {
            low: 0,
            medium: 1,
            high: 2,
            critical: 3
          }

          return orders[a.id] - orders[b.id]
        }
      }
    }
  }),
  computed: {
    hasChartData() {
      return Object.values(this.chartData).every((group) => group.value.length)
    },
    getTotalNumberOfPagination() {
      return Math.ceil(this.totalPage / this.pageSize)
    }
  },
  async created() {
    this.$store.dispatch('changePageTitle', 'Scans')
    await Promise.all([this.fetchScansChartData(), this.fetchScansListing()])
  },
  methods: {
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
        }
      )
    },
    async fetchScansListing() {
      const queryParams = {
        page: this.page,
        pageSize: this.pageSize
      }
      const { scans, total } = await getScansListDataService(
        this.$axios,
        queryParams
      )
      this.totalPage = total
      this.scans = scans
    },
    async dataChange() {
      await this.fetchScansChartData()
      await this.fetchScansListing()
    }
  }
}
</script>
