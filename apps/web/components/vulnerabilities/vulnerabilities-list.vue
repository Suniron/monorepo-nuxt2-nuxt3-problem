<script>
import _ from 'lodash'
import { severityColor } from '~/utils/color.utils'

export default {
  name: 'VulnerabilitiesList',
  data() {
    return {
      panel: []
    }
  },
  computed: {
    mergeAffectedAssetsVulnerabilities() {
      return this.vulnerabilities.map((vuln) => {
        vuln.mergeAffectedAssets = _.chain(vuln.affectedAssets)
          .groupBy('id')
          .map((objs, key) => ({
            countAffected: objs.length,
            id: key,
            name: objs[0].name,
          }))
          .value()
        return vuln
      })
    },
  },
  watch: {
    vulnerabilities() {
      this.panel = []

      // Automatically open the panel if there is only one vulnerability displayed
      if (this.vulnerabilities.length === 1) {
        this.panel = 0
      }
    }
  },
  created() {
    console.log('VULN', this.vulnerabilities)
  },
  methods: {
    getAffectedAssetUrl(asset, vuln) {
      const location = {
        name: 'assets-id',
        params: {
          id: asset.id,
        },
        query: {
          search: vuln.name,
        },
      }

      return this.localePath(location)
    },
    getMaxSeverityColor(assets) {
      const maxSeverity = [...assets]
        .sort((a, b) => b.cvssScore - a.cvssScore || 0)
        .find(asset => asset.severity)?.severity
      return severityColor(maxSeverity)
    },
  },
  props: {
    vulnerabilities: {
      default: () => [],
      type: Array,
    },
  },
}
</script>

<template>
  <v-data-iterator
    v-if="mergeAffectedAssetsVulnerabilities.length > 0"
    :items="mergeAffectedAssetsVulnerabilities"
    :items-per-page="200"
    item-key="id"
    hide-default-footer
  >
    <template #default="{ items: listVulnerabilities }">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel v-for="vuln of listVulnerabilities" :key="vuln.id">
          <v-expansion-panel-header>
            <div class="vulnerability-header">
              <div class="vulnerability-header__name">
                {{ vuln.name }}
              </div>
              <v-chip
                label
                small
                :color="getMaxSeverityColor(vuln.affectedAssets)"
              >
                {{ vuln.affectedAssets.length }}
              </v-chip>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <div>
              <h4>Description:</h4>
              <p v-html="vuln.description" />
            </div>
            <div>
              <h4>Remediation:</h4>
              <p v-html="vuln.remediation" />
            </div>
            <div>
              <h4>Assets affected:</h4>
              <ul class="mt-4">
                <li v-for="asset of vuln.mergeAffectedAssets" :key="asset.id">
                  <v-btn text nuxt :to="getAffectedAssetUrl(asset, vuln)">
                    {{ asset.name }}
                  </v-btn>
                  <v-chip v-if="asset.countAffected > 1" small>
                    {{ asset.countAffected }} Affected interfaces
                  </v-chip>
                  <v-chip v-else small>
                    {{ asset.countAffected }} Affected interface
                  </v-chip>
                </li>
              </ul>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-data-iterator>
</template>

<style lang="scss">
.vulnerability-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .vulnerability-header__name {
    @media screen and (max-width: 959px) {
      width: 100%;
      margin-bottom: 16px;
    }
  }

  &__severity,
  &__likelihood {
    margin-left: 16px;
    @media screen and (max-width: 959px) {
      margin-left: 0;
      margin-right: 8px;
    }
  }
}

.vulnerability-content {
  p {
    white-space: pre-wrap;
  }
}
</style>
