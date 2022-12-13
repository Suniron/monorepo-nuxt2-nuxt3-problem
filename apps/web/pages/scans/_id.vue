<script>
import ScanSummary from '~/components/scans/details/ScanSummary.vue'
import ScanTotalAssets from '~/components/scans/details/ScanTotalAssets.vue'
import ScanVulnSeverityChart from '~/components/scans/details/ScanVulnSeverityChart.vue'
import ScanTabDetails from '~/components/scans/details/ScanTabDetails.vue'
import { getScanDetails } from '~/services/scans'
export default {
  components: {
    ScanSummary,
    ScanTabDetails,
    ScanTotalAssets,
    ScanVulnSeverityChart,
  },
  computed: {
    scanId() {
      return parseInt(this.$route.params.id)
    }
  },
  data: () => {
    return {
      scanSummary: {},
      assetScope: [],
      scanVulnAssets: [],
      vulnerabilities: []
    }
  },
  async created() {
    this.$store.dispatch('changePageTitle', 'Scan details')
    // @ts-expect-error
    if (!this.$route.params.id || isNaN(this.$route.params.id)) {
      // @ts-expect-error
      this.$nuxt.error({ statusCode: 400 })
    }
    const scanDetails = await getScanDetails(this.$axios, this.$route.params.id)
    this.scanSummary = scanDetails.scan
    this.assetScope = scanDetails.scope
    this.scanVulnAssets = scanDetails.scan_result_vulnerabilities
    this.vulnerabilities = scanDetails.vulnerabilities
  },
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <!-- SCAN SUMMURY AND STATS -->
        <v-row>
          <v-col><ScanSummary :scan-summary="scanSummary" /></v-col>
          <v-col>
            <ScanTotalAssets
              :total="assetScope.length"
              :total-vulns="vulnerabilities.length"
            />
          </v-col>
          <v-col>
            <ScanVulnSeverityChart :asset-vulnerabilities="scanVulnAssets" />
          </v-col>
        </v-row>

        <!-- SCAN TAB DETAILS -->
        <ScanTabDetails
          :scan-id="scanId"
          :asset-vulnerabilities="scanVulnAssets"
          :vulnerabilities="vulnerabilities"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
