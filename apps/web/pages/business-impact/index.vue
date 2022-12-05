<template>
  <v-container>
    <loading-spinner v-if="loading" />

    <template v-else-if="businessMissions.length > 0">
      <BusinessImpactSummaryHeader :missions="businessMissions" />
      <v-expansion-panels>
        <BusinessMission
          :available-business-impacts="availableBusinessImpacts"
          v-for="businessMission in businessMissions"
          :curr-mission="businessMission"
          :key="businessMission.id"
        />
      </v-expansion-panels>
      <v-pagination
        v-if="totalPage > 1"
        v-model="filters.page"
        class="my-4"
        :length="totalPage"
        @next="fetchDatas()"
        @previous="fetchDatas()"
        @input="fetchDatas()"
      >
      </v-pagination>
    </template>

    <!-- Show an alert if no Business Mission -->
    <v-alert text type="info" v-else>
      No Business Mission found
    </v-alert>
  </v-container>
</template>

<script>
import { searchAssetsService } from '~/services/assets'
import { fetchBusinessImpactList } from '~/services/businessMissionAnalysis'
import BusinessMission from '~/components/business-impact/BusinessMission.vue'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import BusinessImpactSummaryHeader from '~/components/business-impact/BusinessImpactSummaryHeader.vue'

export default {
  name: 'BusinessAnalysis',
  components: {
    BusinessMission,
    LoadingSpinner,
    BusinessImpactSummaryHeader
  },
  data() {
    return {
      loading: true,
      item: [],
      businessMissions: [],
      filters: {
        page: 1
      },
      totalPage: 0,
      availableBusinessImpacts: []
    }
  },
  created() {
    this.fetchDatas()

    this.$store.dispatch('changePageTitle', 'Business Impact')
  },
  methods: {
    async fetchDatas() {
      this.loading = true
      await Promise.all([this.fetchBusinessImpacts(), this.fetchAssets()])
      this.loading = false
    },
    async fetchAssets() {
      try {
        const serviceParams = {
          page: this.filters.page,
          pageSize: 10,
          types: ['MISSION']
        }
        const { assets, total } = await searchAssetsService(
          this.$axios,
          serviceParams
        )

        this.businessMissions = assets
        this.totalPage = Math.ceil(total / serviceParams.pageSize)
      } catch (error) {
        console.error(error)
      }
    },
    async fetchBusinessImpacts() {
      this.availableBusinessImpacts = await fetchBusinessImpactList(this.$axios)
    }
  }
}
</script>
