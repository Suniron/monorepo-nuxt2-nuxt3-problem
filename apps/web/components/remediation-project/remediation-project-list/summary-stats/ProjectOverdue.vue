<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectSummary} RemediationProjectSummary
 */

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      /**
       * @returns {RemediationProjectSummary[]}
       */
      remediationProjects: state =>
        state.remediationProject.remediationProjects || [],
    }),
    /**
     * @return {number}
     */
    nb_project_overdue() {
      return this.remediationProjects?.filter(project => project.is_overdue)
        .length
    },
  },
  methods: {
    resetSortTable() {
      this.$root.$emit('remediationProjectList:resetSort')
    },
  },
}
</script>

<template>
  <v-card
    :link="nb_project_overdue > 0"
    class="d-flex align-center"
    height="95px"
    @click="resetSortTable"
  >
    <v-card-text class="text-center text-body-1">
      <v-chip v-if="nb_project_overdue" class="ma-2" color="warning">
        {{
          nb_project_overdue
        }}
      </v-chip>
      <v-chip
        v-else-if="nb_project_overdue === 0 && remediationProjects.length > 0"
        class="ma-2"
        color="light-green lighten-2"
      >
        {{ $t('projectManagement.remediationProject.projectInTime') }}
      </v-chip>
      <div v-if="nb_project_overdue || remediationProjects.length === 0">
        {{
          $tc(
            'projectManagement.remediationProject.projectOverdue',
            nb_project_overdue,
          )
        }}
      </div>
    </v-card-text>
  </v-card>
</template>

<style>
.stats-cursor:hover {
  cursor: pointer;
}
</style>
