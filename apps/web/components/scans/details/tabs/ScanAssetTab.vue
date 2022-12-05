<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-text-field
          v-model="search"
          class="my-2"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="assetsVulnsGroupedBySeverity"
      sort-by="vulnerabilities"
      sort-desc
      :items-per-page="5"
      :item-class="() => 'scan-asset-row'"
      @click:row="goToAsset"
      class="elevation-1 scan-assets-table"
    >
      <template #[`item.vulnerabilities`]="{ item }">
        <v-row @click.stop>
          <VulnsStackedBars
            class="flex-grow-1"
            :asset-with-vuln="item"
            :max-vulns="maxVulnOnSingleAsset"
          />
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import _ from 'lodash'
import VulnsStackedBars from '../VulnsStackedBars.vue'
import { severityLevelString } from '~/utils/risk.utils'

export default {
  components: { VulnsStackedBars },
  props: {
    assetVulnerabilities: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Asset name',
          width: '20%',
          value: 'asset_name'
        },
        {
          text: 'Vulnerabilitiy',
          width: '80%',
          sort: this.sortVulns,
          value: 'vulnerabilities'
        }
      ]
    }
  },
  computed: {
    /**
     * @returns {Array}
     */
    items() {
      return this.assetVulnerabilities.reduce((acc, av) => {
        const index = acc.findIndex((a) => a.asset_id === av.asset_id)
        if (acc[index]) {
          acc[index].vulnerabilities.push({
            vulnerability_id: av.vulnerability_id,
            severity: av.severity || severityLevelString(av.cvss_score)
          })
        } else {
          acc.push({
            asset_id: av.asset_id,
            asset_name: av.asset_name,
            vulnerabilities: [
              {
                vulnerability_id: av.vulnerability_id,
                severity: av.severity || severityLevelString(av.cvss_score)
              }
            ]
          })
        }
        return acc
      }, [])
    },
    /**
     * @returns {Array}
     */
    assetsVulnsGroupedBySeverity() {
      return this.items.map((item) => ({
        ...item,
        vulnerabilities: _.countBy(item.vulnerabilities, 'severity')
      }))
    },
    /**
     * @returns {Number}
     */
    maxVulnOnSingleAsset() {
      return this.items.reduce(
        (acc, asset) =>
          Math.max(
            acc,
            asset.vulnerabilities.filter((vuln) => vuln.severity !== 'info')
              .length
          ),
        0
      )
    }
  },
  methods: {
    /**
     * @param {{critical: number, high: number, medium: number, low: number, info: number}} a
     * @param {{critical: number, high: number, medium: number, low: number, info: number}} b
     */
    sortVulns(a, b) {
      // A bit verbose, but useful to ignore the other unwanted severities like "info"
      return (
        (a.critical ?? 0) +
        (a.high ?? 0) +
        (a.medium ?? 0) +
        (a.low ?? 0) -
        ((b.critical ?? 0) + (b.high ?? 0) + (b.medium ?? 0) + (b.low ?? 0))
      )
    },
    goToAsset(item) {
      this.$router.push(
        this.localePath({
          name: 'assets-id',
          params: { id: item.asset_id }
        })
      )
    }
  }
}
</script>

<style lang="scss">
.scan-assets-table {
  .scan-asset-row {
    cursor: pointer;
  }

  .crit {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    background-color: #941e1e;
    color: white;
  }
  .high {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    background-color: #d92b2b;
    color: white;
  }
  .medium {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    background-color: #ed9b0e;
    color: black;
  }
  .low {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2em;
    background-color: #f0d802;
    color: black;
  }
}
</style>
