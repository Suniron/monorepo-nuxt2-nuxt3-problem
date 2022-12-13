<script>
// import AssetVulnerabilities from '~/components/assets/details/vulnerabilities'
// import AssetSitemap from '~/components/assets/details/sitemap'
import AssetProfile from '~/components/assets/details/AssetProfile.vue'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'

// Services
import { searchAssetByIdService } from '~/services/assets'
import { ASSET_TYPES } from '~/utils/asset.utils'

export default {
  components: {
    // AssetVulnerabilities,
    // AssetSitemap,
    AssetProfile,
    AssetInfo
  },
  name: 'AssetDetailsPage',
  middleware: ['auth'],
  data() {
    return {
      /**
       * @type {Object}
       */
asset: null,
      
      tab: 0
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
              disabled: false,
              exact: true,
              text: 'Assets',
              to: '/assets',
            },
            {
              text: ASSET_TYPES.find(type => type.type === this.asset.type)
                .text,
              to: `/assets?types=${this.asset.type}`,
            },
            {
              disabled: true,
              text: this.asset.name,
            },
          ]
        : []
    },
  },
  created() {
    this.asset = this.fetchAsset(this.$route.params.id)
    this.$root.$on('fetchDataAgain', this.saveAsset)
    this.$store.dispatch('changePageTitle', 'Assets')
  },
  methods: {
    fetchAsset(id) {
      searchAssetByIdService(this.$axios, id).then((response) => {
        this.asset = response
      })
    },
    saveAsset() {
      this.asset = this.fetchAsset(this.$route.params.id)
    },
  },
}
</script>

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

<style lang="scss"></style>
