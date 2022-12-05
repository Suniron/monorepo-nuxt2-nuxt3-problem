<template>
  <v-container>
    <v-row justify="end">
      <v-btn class="ma-3" color="secondary" @click="deleteScan()"
        >Delete Scan</v-btn
      >
      <v-btn
        class="ma-3"
        color="primary"
        :loading="generatingReport"
        @click="downloadReport()"
        >Download report</v-btn
      >
    </v-row>
    <v-row justify="center">
      <v-col>
        <v-tabs v-model="tab" centered>
          <!-- TABS SELECTION -->
          <v-tab>Assets ({{ numberOfAssets }})</v-tab>
          <v-tab>Vulnerabilities ({{ vulnerabilities.length }})</v-tab>

          <!-- TABS CONTENT -->
          <v-tab-item class="pa-4">
            <ScanAssetTab :asset-vulnerabilities="assetVulnerabilities" />
          </v-tab-item>
          <v-tab-item class="pa-4">
            <ScanVulnerabilityTab
              :asset-vulnerabilities="assetVulnerabilities"
              :vulnerabilities="vulnerabilities"
            />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ScanAssetTab from './tabs/ScanAssetTab.vue'
import ScanVulnerabilityTab from './tabs/ScanVulnerabilityTab.vue'
import { downloadReportFile, updateScanService } from '~/services/scans'

export default {
  components: {
    ScanAssetTab,
    ScanVulnerabilityTab
  },
  props: {
    scanId: {
      type: Number,
      required: true
    },
    assetVulnerabilities: {
      type: Array,
      required: true
    },
    vulnerabilities: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      generatingReport: false,
      tab: 0
    }
  },
  computed: {
    /**
     * @returns {Number}
     */
    numberOfAssets() {
      return this.assetVulnerabilities.reduce((acc, av) => {
        if (acc.includes(av.asset_id)) return acc
        acc.push(av.asset_id)
        return acc
      }, []).length
    }
  },
  methods: {
    async deleteScan() {
      await updateScanService(this.$axios, this.scanId, { status: 'todelete' })
      this.$router.push({ path: '/scans' })
    },
    async downloadReport() {
      this.generatingReport = true
      const { fileName, file } = await downloadReportFile(
        this.$axios,
        this.scanId
      )
      const url = window.URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      this.generatingReport = false
      link.click()
    }
  }
}
</script>
