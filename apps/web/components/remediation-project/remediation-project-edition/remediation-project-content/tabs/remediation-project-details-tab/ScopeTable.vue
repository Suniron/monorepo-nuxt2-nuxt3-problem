<template>
  <v-data-table
    class="row-pointer"
    :headers="headers"
    :items-per-page="5"
    :items="projectDetailsScope"
    @click:row="handleRowClick"
    multi-sort
  >
    <template #[`item.remediation`]="{ item }">
      <v-tooltip top open-delay="750" open-on-hover max-width="400">
        <template #activator="{ on, attrs }">
          <td v-bind="attrs" v-on="on">
            {{ reduceRemediation(item.remediation) }}
          </td>
        </template>
        <span>{{ item.remediation }}</span>
      </v-tooltip>
    </template>
    <template #[`item.is_done`]="{ item }">
      <v-simple-checkbox
        :disabled="!isScopeTableEditable"
        color="success"
        :value="item.is_done"
        @click="onCompletionChange(item)"
      ></v-simple-checkbox>
    </template>
  </v-data-table>
</template>

<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').SpecificRemediationProject} SpecificRemediationProject
 */
import { mapState, mapActions } from 'vuex'
import { updateRemediationProjectScopeItemService } from '~/services/remediation-projects'
import { parseRemediationHtml } from '~/utils/remediationProject.utils'

export default {
  data() {
    return {
      headers: [
        {
          cellClass: 'clickable-cell',
          text: 'Asset Type',
          value: 'asset_type'
        },
        {
          cellClass: 'clickable-cell',
          text: 'Asset Name',
          value: 'asset_name'
        },
        {
          cellClass: 'clickable-cell',
          text: 'Vulnerability',
          value: 'vulnerability_name'
        },
        {
          cellClass: 'clickable-cell',
          text: 'Severity',
          value: 'severity',
          sort: (a, b) => {
            const severityA = a ?? 'null'
            const severityB = b ?? 'null'
            // Get available weights from existing priorities
            const weights = { null: 0, low: 1, medium: 2, high: 3, critical: 4 }

            // Sort by weight
            return weights[severityA] - weights[severityB]
          }
        },
        {
          cellClass: 'clickable-cell',
          text: 'Remediation',
          value: 'remediation'
        },
        { cellClass: 'clickable-cell', text: 'Completion', value: 'is_done' }
      ]
    }
  },
  computed: {
    ...mapState('user', { userId: 'id' }),
    ...mapState({
      /**
       * @returns {import('~/types/remediationProject').RemediationProjectScopeItem[]}
       */
      projectDetailsScope: (state) =>
        state.remediationProject.projectDetails?.scope ?? [],
      /**
       * @returns {import('~/types/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: (state) =>
        state.remediationProject.projectDetails?.info
    }),
    /**
     * @returns {boolean}
     */
    isScopeTableEditable() {
      return (
        this.projectDetailsInfo?.status === 'in_progress' &&
        (this.projectDetailsInfo.assignees.some(
          (assignee) => assignee.user_id === this.userId
        ) ||
          this.projectDetailsInfo.owner_id === this.userId)
      )
    }
  },
  methods: {
    ...mapActions({
      fetchRemediationProjectDetailsScope:
        'remediationProject/fetchRemediationProjectDetailsScope'
    }),
    /**
     * @param {import('~/types/remediationProject').RemediationProjectScopeItem} scope
     */
    async onCompletionChange(scope) {
      if (!this.isScopeTableEditable || !this.projectDetailsInfo) {
        return
      }

      try {
        // Update scope item in database:
        await updateRemediationProjectScopeItemService(
          this.$axios,
          this.projectDetailsInfo.project_id,
          {
            ...scope,
            is_done: !scope.is_done
          }
        )

        // Refresh scope in store:
        await this.fetchRemediationProjectDetailsScope(
          this.projectDetailsInfo.project_id
        )
      } catch (error) {
        // TODO: Handle request error
      }
    },
    reduceRemediation(remediation) {
      return parseRemediationHtml(remediation, 50)
    },
    /**
     * @param {import('~/types/remediationProject').RemediationProjectScopeItem} rowInfo
     */
    handleRowClick(rowInfo) {
      // @ts-ignore
      this.$router.push(`/assets/${rowInfo.asset_id}`)
    }
  }
}
</script>

<style lang="scss">
.clickable-cell {
  cursor: pointer;
}
</style>
