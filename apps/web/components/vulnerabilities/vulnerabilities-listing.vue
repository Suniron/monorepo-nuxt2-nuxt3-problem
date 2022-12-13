<script>
export default {
  name: 'VulnerabilitiesListing',
  methods: {
    getAffectedAssetUrl(asset, vuln) {
      const location = {
        name: 'assets-id',
        params: {
          id: asset.id
        },
        query: {
          search: vuln.name
        }
      }

      return this.localePath(location)
    }
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
    :items="vulnerabilities"
    :items-per-page="200"
    item-key="id"
    hide-default-footer
  >
    <template #default="{ items: listVulnerabilities }">
      <v-expansion-panels>
        <v-expansion-panel v-for="vuln of listVulnerabilities" :key="vuln.id">
          <v-expansion-panel-header>
            <div class="vulnerability-header">
              <div class="vulnerability-header__name">
                {{ vuln.name }}
              </div>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h4>Assets affected:</h4>
            <ul class="mt-4">
              <li v-for="asset of vuln.affectedAssets" :key="asset.id">
                <a :href="getAffectedAssetUrl(asset, vuln)">
                  {{ asset.name }}
                </a>
              </li>
            </ul>
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
