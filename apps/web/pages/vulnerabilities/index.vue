<script>
import VulnerabilitiesToolbar from '~/components/vulnerabilities/vulnerabilities-toolbar'
import VulnerabilitiesList from '~/components/vulnerabilities/vulnerabilities-list'
import Pagination from '~/components/utils/Pagination.vue'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchVulnerabilitiesWithTheirAssetsService } from '~/services/vulnerabilities'

export default {
  components: {
    VulnerabilitiesToolbar,
    VulnerabilitiesList,
    Pagination
  },
  name: 'VulnerabilitiesPage',
  mixins: [queryManager],
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'Vulnerabilities')
    this.setFiltersFromQuery(this.$route.query)
    this.fetchVulnerabilities()
  },
  data() {
    return {
      filters: {
        likelihoods: [],
        search: '',
        page: 1,
        severities: [],
        pageSize: 10,
      },
      total: 0,
      vulnerabilities: [],
    }
  },
  methods: {
    async fetchVulnerabilities() {
      try {
        const params = {
          likelihoods: this.filters.likelihoods || undefined,
          page: this.filters.page,
          pageSize: this.filters.pageSize,
          search: this.filters.search || undefined,
          severities: this.filters.severities || undefined,
        }
        const {
          vulnerabilities,
          total,
        } = await searchVulnerabilitiesWithTheirAssetsService(
          this.$axios,
          params,
        )
        // Sort vulnerabilities by descending number of affected assets
        vulnerabilities.sort((a, b) => {
          return b.affectedAssets.length - a.affectedAssets.length
        })
        this.vulnerabilities = vulnerabilities
        this.total = total
      }
      catch (error) {
        console.error(error)
      }
    },
    setFilter({ name, value }) {
      if (name === 'search')
        this.filters.search = value
      else if (name === 'severities')
        this.filters.severities = value
      else if (name === 'likelihoods')
        this.filters.likelihoods = value

      this.fetchVulnerabilities()
      this.mx_updateQueryParam({ name, value })
    },
    setFiltersFromQuery(query) {
      if (!query)
        return

      if (query.search)
        this.setFilter({ name: 'search', value: query.search })

      if (query.severities) {
        this.setFilter({
          name: 'severities',
          value: query.severities.split(','),
        })
      }

      if (query.likelihoods) {
        this.setFilter({
          name: 'likelihoods',
          value: query.likelihoods.split(','),
        })
      }
    },
    setPageParams({ page, pageSize }) {
      this.filters.page = page
      this.filters.pageSize = pageSize
      this.fetchVulnerabilities()
    },
  },
  watch: {
    $route(to, from) {
      if (to.query.types !== from.query.types) {
        this.filters.likelihoods = []
        this.filters.severities = []
      }
      console.log('QUERY', to.query)
      this.setFiltersFromQuery(to.query)
    },
  },
}
</script>

<template>
  <v-container class="vulnerabilities">
    <VulnerabilitiesToolbar
      :search="filters.search"
      @filter="setFilter"
      @change="fetchVulnerabilities()"
    />
    <VulnerabilitiesList :vulnerabilities="vulnerabilities" />
    <Pagination
      class="my-4"
      :total-record="total"
      :default-page-size="filters.pageSize"
      @newPage="setPageParams"
    />
  </v-container>
</template>

<style lang="scss"></style>
