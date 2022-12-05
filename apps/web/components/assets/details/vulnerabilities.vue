<template>
  <v-sheet class="asset-vulnerabilities" rounded>
    <vulnerabilities-toolbar
      :asset="asset"
      :filters="filters"
      @filter="updateFilter"
      @change="vulnForm = !vulnForm"
      :key="componentKey"
    />
    <vulnerabilities-list
      v-if="!vulnForm"
      :vulnerabilities="vulnerabilities"
      :asset="asset"
      class="mt-10"
      @saved="fetchAssetVulnerabilities"
      :panel-prop="panel"
      :tab-prop="tab"
      :key="componentKey + 1"
    />
    <vulnerability-form
      v-else
      class="mt-10"
      :asset="asset"
      @close="closeVulnForm"
      :key="componentKey + 2"
    />
  </v-sheet>
</template>

<script>
import VulnerabilitiesToolbar from '~/components/assets/details/vulnerabilities-toolbar'
import VulnerabilitiesList from '~/components/assets/details/vulnerabilities-list'
import VulnerabilityForm from '@/components/assets/details/vulnerability-form.vue'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchAssetVulnerabilities } from '~/services/assets'

function getSeverityWeight(severity) {
  switch (
    severity?.toLowerCase() // Using a switch-case since we have a default case
  ) {
    case 'critical':
      return 10
    case 'high':
      return 8
    case 'medium':
      return 6
    case 'low':
      return 4
    case 'info':
      return 2
    default:
      return 0
  }
}

function getStatusWeight(status) {
  switch (
    status?.toLowerCase() // Using a switch-case since we have a default case
  ) {
    case 'closed':
      return 0
    case 'remediated':
      return 0
    case 'accepted':
      return 50
    default:
      return 100
  }
}

export default {
  name: 'AssetVulnerabilities',
  components: {
    VulnerabilitiesToolbar,
    VulnerabilitiesList,
    VulnerabilityForm
  },
  mixins: [queryManager],
  props: {
    asset: {
      type: Object,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    tabs: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      componentKey: 0,
      filters: {
        search: '',
        severities: [],
        vulnId: null,
        tabId: null
      },
      vulnerabilities: [],
      panel: -1,
      tab: -1,
      vulnForm: false
    }
  },
  watch: {
    // whenever tab is 0 (so we're trying to access vuln tab), this function will run and fetch our vuln again (we might have delete an IP)
    tabs(newTab) {
      if (newTab === 0) {
        this.fetchAssetVulnerabilities()
      }
    }
  },
  created() {
    this.getFiltersFromQuery(this.$route.query)
    this.$root.$on('handleChangeOnVulnForm', this.handleFormChanging)
    this.fetchAssetVulnerabilities()
  },
  methods: {
    closeVulnForm() {
      this.fetchAssetVulnerabilities()
      this.vulnForm = false
    },
    forceRerender() {
      this.componentKey += 1
    },
    handleFormChanging() {
      this.fetchAssetVulnerabilities()
      this.forceRerender()
    },
    getFiltersFromQuery(query) {
      if (!query) return

      if (query.search) {
        this.filters.search = query.search
      }

      if (query.severities) {
        this.filters.severities = query.severities.split(',')
      }

      if (query.vulnId) {
        this.filters.vulnId = query.vulnId
      }

      if (query.tabId) {
        this.filters.tabId = query.tabId
        this.tab = parseInt(query.tabId)
      }
    },
    async fetchAssetVulnerabilities() {
      try {
        const params = {
          search: this.filters.search || undefined,
          severities:
            Array.isArray(this.filters.severities) &&
            this.filters.severities.length
              ? [...this.filters.severities]
              : undefined
        }

        const { vulnerabilities } = await searchAssetVulnerabilities(
          this.$axios,
          this.asset.id,
          params
        )
        vulnerabilities.forEach((vulnerability) => {
          // orders all affected lines inside the vulnerability by the least advanced status and the highest severity
          vulnerability.details.sort((a, b) => {
            return (
              getStatusWeight(b.status) +
              getSeverityWeight(b.severity) -
              (getStatusWeight(a.status) + getSeverityWeight(a.severity))
            )
          })
          vulnerability.orderScore =
            getSeverityWeight(vulnerability.details[0].severity) +
            getStatusWeight(vulnerability.details[0].status)
        })
        // orders all vulnerabilities by the order score
        vulnerabilities.sort((a, b) => {
          return b.orderScore - a.orderScore
        })
        this.vulnerabilities = vulnerabilities
        if (this.filters.vulnId) this.getIndex(this.filters.vulnId)
      } catch (error) {
        console.error(error)
      }
    },
    updateFilter({ name, value }) {
      const areDifferentSevs = (sev1, sev2) =>
        sev1.length !== sev2.length || sev1.some((s1) => !sev2.includes(s1))

      let filterChanged = false
      if (name === 'search' && value !== this.filters.search) {
        this.filters.search = value
        filterChanged = true
      } else if (
        name === 'severities' &&
        areDifferentSevs(value, this.filters.severities)
      ) {
        this.filters.severities = [...value]
        filterChanged = true
      } else if (name === 'vulnId' && value !== this.filters.vulnId) {
        this.filters.vulnId = value
        this.getIndex(value)
        filterChanged = true
      } else if (name === 'tabId' && value !== this.filters.tabId) {
        this.filters.tabId = value
        this.tab = value
        filterChanged = true
      }

      if (filterChanged) {
        this.mx_updateQueryParam({ name, value })
        this.fetchAssetVulnerabilities()
      }
    },
    getIndex(vulnId) {
      const index = this.vulnerabilities.findIndex(
        (elt) => elt.vulnerabilityId === parseInt(vulnId)
      )
      this.panel = index
    }
  }
}
</script>

<style lang="scss">
.asset-vulnerabilities {
  padding: 32px 16px;
}
</style>
