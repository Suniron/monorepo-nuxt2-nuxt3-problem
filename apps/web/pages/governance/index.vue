<template>
  <v-container class="assets">
    <v-data-iterator
      :items="documents"
      :items-per-page="100"
      item-key="id"
      hide-default-footer
    >
      <!-- Toolbar header -->
      <template #header>
        <assets-toolbar
          :assets="assets"
          :search="filters.search"
          :tags="filters.tagIds"
          :severities="filters.severities"
          :groups="filters.groupIds"
          @filter="setFilter"
          @saved="fetchDocuments"
        />
      </template>

      <!-- Cards -->
      <template #default="{ items }">
        <v-row>
          <v-col
            v-for="item of items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <asset-card
              :asset="item"
              @saved="fetchDocuments"
              @delete="fetchDocuments"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import AssetsToolbar from '~/components/assets/assets-toolbar'
import AssetCard from '~/components/assets/asset-card'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchAssetsService } from '~/services/assets'

export default {
  name: 'AssetsPage',
  components: { AssetsToolbar, AssetCard },
  mixins: [queryManager],
  middleware: ['auth'],
  data: () => ({
    filters: {
      search: '',
      tagIds: [],
      groupIds: [],
      severities: [],
      types: []
    },
    documents: []
  }),
  watch: {
    $route(to, from) {
      if (Object.entries(to.query).length === 0)
        this.setFilter({ name: 'types', value: [] })
      else this.setFiltersFromQuery(to.query)
    }
  },
  created() {
    this.setFiltersFromQuery(this.$route.query)

    this.fetchDocuments()

    this.$store.dispatch('changePageTitle', 'Assets')
  },
  methods: {
    async fetchDocuments() {
      try {
        const serviceParams = {}
        if (this.filters.search) serviceParams.search = this.filters.search
        if (this.filters.tagIds?.length)
          serviceParams.tagIds = this.filters.tagIds
        if (this.filters.groupIds?.length)
          serviceParams.groupIds = this.filters.groupIds
        if (this.filters.severities?.length)
          serviceParams.severities = this.filters.severities
        if (this.filters.types?.length) serviceParams.types = this.filters.types
        else serviceParams.types = ['POLICIES', 'PROCEDURES']

        const { documents } = await searchAssetsService(
          this.$axios,
          serviceParams
        )
        this.documents = documents
      } catch (error) {
        console.error(error)
      }
    },
    setFiltersFromQuery(query) {
      if (!query) return

      if (query.search) this.setFilter({ name: 'search', value: query.search })

      if (query.severities)
        this.setFilter({
          name: 'severities',
          value: query.severities.split(',')
        })

      if (query.types)
        this.setFilter({
          name: 'types',
          value: query.types.split(',')
        })
    },
    setFilter({ name, value }) {
      if (name === 'search') {
        this.filters.search = value
      } else if (name === 'tagIds' && Array.isArray(value)) {
        this.filters.tagIds = [...value]
      } else if (name === 'severities') {
        const SEVERITIES = {
          low: 'low',
          medium: 'medium',
          high: 'high',
          critical: 'critical'
        }

        if (
          Array.isArray(value) &&
          (!value.length || value.every((sev) => SEVERITIES[sev]))
        ) {
          this.filters.severities = [...value]
        }
      } else if (name === 'groupIds' && Array.isArray(value)) {
        this.filters.groupIds = [...value]
      } else if (name === 'types' && Array.isArray(value)) {
        this.filters.types = [...value]
      }

      this.mx_updateQueryParam({ name, value })
      this.fetchDocuments()
    }
  }
}
</script>

<style lang="scss"></style>
