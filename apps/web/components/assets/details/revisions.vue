<script>
import RevisionsToolbar from '~/components/assets/details/revisions-toolbar'
import RevisionsList from '~/components/assets/details/revisions-list'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import { searchAssetRevisions } from '~/services/assets'

export default {
  components: { RevisionsToolbar, RevisionsList },
  name: 'AssetRevisions',
  mixins: [queryManager],
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
          new Date(b.fileUploadAt).getTime()
          - new Date(a.fileUploadAt).getTime()
        )
      })
      return sortedVersions[0]?.fileUUID
    },
  },
  created() {
    this.getFiltersFromQuery(this.$route.query)

    this.fetchAssetRevisions()
  },
  methods: {

    async fetchAssetRevisions() {
      try {
        const params = {
          search: this.filters.search || undefined,
        }

        const { revisions } = await searchAssetRevisions(
          this.$axios,
          this.asset.id,
          params,
        )
        this.revisions = revisions
        console.log(this.revisions)
      }
      catch (error) {
        console.error(error)
      }
    },
    /**
     * @param {string} query
     */
    getFiltersFromQuery(query) {
      if (!query)
        return

      if (query.search)
        this.filters.search = query.search
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
  <v-sheet class="asset-vulnerabilities" rounded>
    <RevisionsToolbar
      :filters="filters"
      :latest-version-uuid="latestVersionUuid"
      @filter="updateFilter"
    />
    <RevisionsList
      :revisions="revisions"
      :asset-id="asset.id"
      class="mt-10"
      @saved="fetchAssetRevisions"
    />
  </v-sheet>
</template>

<style lang="scss">
.asset-vulnerabilities {
  padding: 32px 16px;
}
</style>
