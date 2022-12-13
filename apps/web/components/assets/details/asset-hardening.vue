<script>
import HardeningToolbar from '~/components/assets/details/hardening-toolbar'
import HardeningList from '~/components/assets/details/hardening-list'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchAssetVulnerabilities } from '~/services/assets'

export default {
  components: {
    HardeningToolbar,
    HardeningList
  },
  name: 'AssetHardening',
  mixins: [queryManager],
  data() {
    return {
      filters: {
        search: '',
        hardening: [],
        vulnId: null,
        tabId: null
      },
      hardening: [],
      panel: -1,
      tab: -1
    }
  },
  created() {
    this.getFiltersFromQuery(this.$route.query)

    this.fetchAssetHardening()
  },
  methods: {
    async fetchAssetHardening() {
      try {
        const params = {
          search: this.filters.search || undefined,
          severities:
            Array.isArray(this.filters.severities)
            && this.filters.severities.length
              ? [...this.filters.severities]
              : undefined,
          type: 'hardening',
        }

        const { vulnerabilities } = await searchAssetVulnerabilities(
          this.$axios,
          this.asset.id,
          params,
        )
        this.hardening = vulnerabilities
        if (this.filters.hardId)
          this.getIndex(this.filters.hardId)
      }
      catch (error) {
        console.error(error)
      }
    },
    getFiltersFromQuery(query) {
      if (!query)
        return

      if (query.search)
        this.filters.search = query.search

      if (query.severities)
        this.filters.severities = query.severities.split(',')

      if (query.hardId)
        this.filters.hardId = query.hardId

      if (query.tabId) {
        this.filters.tabId = query.tabId
        this.tab = parseInt(query.tabId)
      }
    },
    getIndex(hardId) {
      const index = this.hardening.findIndex(
        elt => elt.hardId === parseInt(hardId),
      )
      this.panel = index
    },
    saveVuln(form) {
      console.log(form)
    },
    updateFilter({ name, value }) {
      const areDifferentSevs = (sev1, sev2) =>
        sev1.length !== sev2.length || sev1.some(s1 => !sev2.includes(s1))

      let filterChanged = false
      if (name === 'search' && value !== this.filters.search) {
        this.filters.search = value
        filterChanged = true
      }
      else if (
        name === 'severities'
        && areDifferentSevs(value, this.filters.severities)
      ) {
        this.filters.severities = [...value]
        filterChanged = true
      }
      else if (name === 'hardId' && value !== this.filters.hardId) {
        this.filters.hardId = value
        this.getIndex(value)
        filterChanged = true
      }
      else if (name === 'tabId' && value !== this.filters.tabId) {
        this.filters.tabId = value
        this.tab = value
        filterChanged = true
      }

      if (filterChanged) {
        this.mx_updateQueryParam({ name, value })
        this.fetchAssetHardening()
      }
    },
  },
  props: {
    asset: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <v-sheet class="asset-hardening" rounded>
    <HardeningToolbar
      :asset="asset"
      :filters="filters"
      @filter="updateFilter"
    />
    <HardeningList
      :hardening="hardening"
      :asset="asset"
      class="mt-10"
      :panel-prop="panel"
      :tab-prop="tab"
      @saved="fetchAssetHardening"
    />
  </v-sheet>
</template>

<style lang="scss">
.asset-hardening {
  padding: 32px 16px;
}
</style>
