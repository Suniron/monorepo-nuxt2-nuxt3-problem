<template>
  <v-card height="100%">
    <v-card-title> Project infos </v-card-title>
    <v-card-text v-if="!projectDetailsInfo">
      <v-alert type="warning">Error, project not found</v-alert>
      <p>{{ projectDetailsInfo }}</p>
    </v-card-text>

    <v-card-text v-else class="text-body-2">
      <table>
        <tbody>
          <tr>
            <td>ID</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium"
                >{{ projectPrefixId
                }}{{ projectDetailsInfo.project_id }}</v-chip
              >
            </td>
          </tr>
          <tr>
            <td>Name</td>
            <td class="pl-2 font-weight-medium">
              {{ projectDetailsInfo.project_name }}
            </td>
          </tr>
          <tr>
            <td>Creation</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">{{
                getFormattedDate(projectDetailsInfo.creation_date)
              }}</v-chip>
            </td>
          </tr>
          <tr v-if="projectDetailsInfo.start_date">
            <td>Start date</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">{{
                getFormattedDate(projectDetailsInfo.start_date)
              }}</v-chip>
            </td>
          </tr>
          <tr>
            <td>Deadline</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">{{
                getFormattedDate(projectDetailsInfo.due_date)
              }}</v-chip>
            </td>
          </tr>
          <tr>
            <td>Priority</td>
            <td class="pl-2">
              <v-chip label small class="font-weight-medium">{{
                projectDetailsInfo.priority
              }}</v-chip>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<script>
// @ts-check
import { format } from 'date-fns'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      /**
       * @returns {string}
       */
      projectPrefixId: (state) =>
        state.remediationProject.remediationProjectIdPrefix,
      /**
       * @returns {import('~/types/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: (state) =>
        state.remediationProject.projectDetails?.info
    })
  },
  methods: {
    /**
     * Returns date like "1994-04-15 17:05"
     *
     * @param {string} date
     * @returns {string}
     */
    getFormattedDate(date) {
      if (!date) {
        return ''
      }

      return format(new Date(date), 'yyyy-MM-dd HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
tr > td {
  padding-top: 1px;
  padding-bottom: 1px;
}
</style>
