<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <!-- STATS / KEY INFORMATIONS -->
        <RemediationProjectSummaryStats />

        <!-- PROJECT CONTENT -->
        <RemediationProjectTable />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RemediationProjectSummaryStats from '~/components/remediation-project/remediation-project-list/summary-stats/index.vue'
import RemediationProjectTable from '~/components/remediation-project/remediation-project-list/ProjectTable.vue'

export default {
  name: 'RemediationProjects',
  components: {
    RemediationProjectSummaryStats,
    RemediationProjectTable
  },
  data() {
    return {
      resetSortTable: false
    }
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Remediation Projects')
  },
  async mounted() {
    try {
      await this.$store.dispatch(
        'remediationProject/fetchRemediationProjectList'
      )
    } catch (error) {
      // TODO: Handle request error
    }
  },
  methods: {
    enabledResetSortTable() {
      this.resetSortTable = true
    }
  }
}
</script>

<style></style>
