<template>
  <v-sheet class="asset-vulnerabilities" rounded>
    <revisions-toolbar
      :filters="filters"
      :latest-version-uuid="latestVersionUuid"
      @filter="updateFilter"
    />
    <revisions-list
      :revisions="revisions"
      :asset-id="asset.id"
      class="mt-10"
      @saved="fetchAssetRevisions"
    />
  </v-sheet>
</template>

<script>
import RevisionsToolbar from '~/components/assets/details/revisions-toolbar'
import RevisionsList from '~/components/assets/details/revisions-list'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchAssetRevisions } from '~/services/assets'

export default {
  name: 'AssetRevisions',
  components: { RevisionsToolbar, RevisionsList },
  mixins: [queryManager],
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filters: {
        search: ''
      },
      revisions: []
    }
  },
  computed: {
    latestVersionUuid() {
      const sortedVersions = [...this.revisions].sort((a, b) => {
        return (
          new Date(b.fileUploadAt).getTime() -
          new Date(a.fileUploadAt).getTime()
        )
      })
      return sortedVersions[0]?.fileUUID
    }
  },
  created() {
    this.getFiltersFromQuery(this.$route.query)

    this.fetchAssetRevisions()
  },
  methods: {
    /**
     * @param {string} query
     */
    getFiltersFromQuery(query) {
      if (!query) return

      if (query.search) {
        this.filters.search = query.search
      }
    },
    async fetchAssetRevisions() {
      try {
        const params = {
          search: this.filters.search || undefined
        }

        const { revisions } = await searchAssetRevisions(
          this.$axios,
          this.asset.id,
          params
        )
        this.revisions = revisions
        console.log(this.revisions)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * @param {{name: string, value: string}} param
     */
    updateFilter({ name, value }) {
      let filterChanged = false
      if (name === 'search' && value !== this.filters.search) {
        this.filters.search = value
        filterChanged = true
      }

      if (filterChanged) {
        this.mx_updateQueryParam({ name, value })
        this.fetchAssetRevisions()
      }
    }
  }
}
</script>

<style lang="scss">
.asset-vulnerabilities {
  padding: 32px 16px;
}
</style>
