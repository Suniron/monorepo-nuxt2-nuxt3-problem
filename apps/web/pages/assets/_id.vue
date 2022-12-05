<template>
  <v-container class="asset-details">
    <v-row>
      <v-breadcrumbs :items="breadCrumbs" />
    </v-row>
    <v-row v-if="asset">
      <v-col cols="12">
        <AssetProfile :asset="asset" />
      </v-col>
    </v-row>
    <v-row v-if="asset">
      <AssetInfo :asset="asset" section="tabs" />
    </v-row>
  </v-container>
</template>

<script>
// import AssetVulnerabilities from '~/components/assets/details/vulnerabilities'
// import AssetSitemap from '~/components/assets/details/sitemap'
import AssetProfile from '~/components/assets/details/AssetProfile.vue'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'

// Services
import { searchAssetByIdService } from '~/services/assets'
import { ASSET_TYPES } from '~/utils/asset.utils'

export default {
  name: 'AssetDetailsPage',
  components: {
    // AssetVulnerabilities,
    // AssetSitemap,
    AssetProfile,
    AssetInfo
  },
  middleware: ['auth'],
  data() {
    return {
      tab: 0,
      /**
       * @type {Object}
       */
      asset: null
    }
  },
  computed: {
    /**
     * @returns {string[]}
     */
    breadCrumbs() {
      return this.asset
        ? [
            {
              text: 'Assets',
              disabled: false,
              to: '/assets',
              exact: true
            },
            {
              text: ASSET_TYPES.find((type) => type.type === this.asset.type)
                .text,
              to: `/assets?types=${this.asset.type}`
            },
            {
              text: this.asset.name,
              disabled: true
            }
          ]
        : []
    }
  },
  created() {
    this.asset = this.fetchAsset(this.$route.params.id)
    this.$root.$on('fetchDataAgain', this.saveAsset)
    this.$store.dispatch('changePageTitle', 'Assets')
  },
  methods: {
    saveAsset() {
      this.asset = this.fetchAsset(this.$route.params.id)
    },
    fetchAsset(id) {
      searchAssetByIdService(this.$axios, id).then((response) => {
        this.asset = response
      })
    }
  }
}
</script>

<style lang="scss"></style>
