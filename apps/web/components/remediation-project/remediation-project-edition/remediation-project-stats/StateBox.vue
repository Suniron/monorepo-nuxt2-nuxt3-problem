<template>
  <v-card height="100%">
    <v-card-title>
      Project state
    </v-card-title>

    <v-card-text v-if="!projectDetailsInfo">
      <v-alert type="warning">Error, project not found</v-alert>
    </v-card-text>

    <v-card-text v-else class="text-body-1">
      <p>
        Status
        <v-chip
          label
          :color="statusColor"
          class="text-uppercase font-weight-bold"
          >{{
            projectDetailsInfo.is_overdue
              ? 'overdue'
              : projectDetailsInfo.status
          }}</v-chip
        >
      </p>
      <p>
        Owner
        <v-chip class="font-weight-bold"
          ><v-icon size="20" class="mr-1">mdi-account</v-icon
          >{{ projectDetailsInfo.owner_name }}</v-chip
        >
      </p>
      <p>
        Assignees<span v-if="!assignees.length">: nobody for now</span>
        <v-chip
          v-else
          class="ma-1"
          small
          v-for="assignee in assignees"
          :key="assignee.user_id"
          ><v-icon size="20" class="mr-1">mdi-account</v-icon
          >{{ assignee.username }}</v-chip
        >
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
// @ts-check
import { mapState } from 'vuex'
import { statusColor } from '~/utils/color.utils'

export default {
  computed: {
    ...mapState({
      /**
       * @returns {import('~/types/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: (state) =>
        state.remediationProject.projectDetails?.info
    }),
    /**
     * @returns {{"background-color": string}|{}}
     */
    statusColor() {
      if (this.projectDetailsInfo?.is_overdue) {
        return statusColor('overdue')
      }

      return statusColor(this.projectDetailsInfo.status)
    },
    /**
     * Get only valid assignees
     * @returns {import('~/types/user').BaseUser[]}
     */
    assignees() {
      // TODO: fix case with no user
      if (!this.projectDetailsInfo?.assignees) {
        return []
      }
      // Filter to exclude assignees with bad id
      return this.projectDetailsInfo.assignees.filter((a) => a?.user_id)
    }
  }
}
</script>
