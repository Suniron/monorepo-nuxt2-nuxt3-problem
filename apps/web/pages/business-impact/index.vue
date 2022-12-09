<script>
import { searchAssetsService } from '~/services/assets'
import { fetchBusinessImpactList } from '~/services/businessMissionAnalysis'
import BusinessMission from '~/components/business-impact/BusinessMission.vue'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import BusinessImpactSummaryHeader from '~/components/business-impact/BusinessImpactSummaryHeader.vue'

export default {
  components: {
    BusinessMission,
    LoadingSpinner,
    BusinessImpactSummaryHeader
  },
  name: 'BusinessAnalysis',
  data() {
    return {
      item: [],
      loading: true,
      businessMissions: [],
      filters: {
        page: 1,
      },
      availableBusinessImpacts: [],
      totalPage: 0
    }
  },
  created() {
    this.fetchDatas()

    this.$store.dispatch('changePageTitle', 'Business Impact')
  },
  methods: {
    async fetchAssets() {
      try {
        const serviceParams = {
          page: this.filters.page,
          pageSize: 10,
          types: ['MISSION'],
        }
        const { assets, total } = await searchAssetsService(
          this.$axios,
          serviceParams,
        )

        this.businessMissions = assets
        this.totalPage = Math.ceil(total / serviceParams.pageSize)
      }
      catch (error) {
        console.error(error)
      }
    },
    async fetchBusinessImpacts() {
      this.availableBusinessImpacts = await fetchBusinessImpactList(this.$axios)
    },
    async fetchDatas() {
      this.loading = true
      await Promise.all([this.fetchBusinessImpacts(), this.fetchAssets()])
      this.loading = false
    },
  },
}
</script>

<template>
  <v-container>
    <LoadingSpinner v-if="loading" />

    <template v-else-if="businessMissions.length > 0">
      <BusinessImpactSummaryHeader :missions="businessMissions" />
      <v-expansion-panels>
        <BusinessMission
          v-for="businessMission in businessMissions"
          :key="businessMission.id"
          :available-business-impacts="availableBusinessImpacts"
          :curr-mission="businessMission"
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
      />
    </template>

    <!-- Show an alert if no Business Mission -->
    <v-alert v-else text type="info">
      No Business Mission found
    </v-alert>
  </v-container>
</template>
