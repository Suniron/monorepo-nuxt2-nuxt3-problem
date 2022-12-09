<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').SpecificRemediationProject} SpecificRemediationProject
 */
import { mapState } from 'vuex'
import ActionButtons from './action-buttons/index.vue'
import ScopeTable from './ScopeTable.vue'

export default {
  components: { ActionButtons, ScopeTable },
  computed: {
    ...mapState({
      projectDetailsInfo: state =>
        state.remediationProject.projectDetails?.info,
    }),
    /**
     * @returns {string}
     */
    projectDescription() {
      return this.projectDetailsInfo?.project_description ?? 'No description'
    },
  },
}
</script>

<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-card>
        <v-card-title>Project description</v-card-title>
        <v-card-text>
          {{ projectDescription }}
        </v-card-text>

        <v-card-title>Project remediation scope</v-card-title>
        <v-card-text>
          <ScopeTable />
        </v-card-text>

        <v-card-actions>
          <ActionButtons />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
