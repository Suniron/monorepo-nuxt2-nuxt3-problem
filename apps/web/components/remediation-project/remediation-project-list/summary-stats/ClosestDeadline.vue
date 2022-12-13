<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectSummary} RemediationProjectSummary
 */
import { mapState } from 'vuex'
import { format } from 'date-fns'

export default {
  computed: {
    ...mapState({

      /**
       * @returns {string}
       */
      remediationProjectIdPrefix: state =>
        state.remediationProject.remediationProjectIdPrefix,

      /**
       * @returns {RemediationProjectSummary[]}
       */
      remediationProjects: state =>
        state.remediationProject.remediationProjects,
    }),
    /**
     * Get the closest deadline project
     * @returns {{"project_id": number, "due_date": string}}
     */
    closestDeadlineProject() {
      const closestProject = this.remediationProjects
        .filter((project) => {
          return (
            new Date(project.due_date).getTime() >= Date.now()
            && !['canceled', 'completed'].includes(project.status)
          )
        })
        .reduce(
          (closest, project) => {
            if (
              !closest.due_date
              || new Date(project.due_date) < new Date(closest.due_date)
            )
              return project

            return closest
          },
          {
            due_date: null,
            project_id: null,
          },
        )
      return {
        due_date: closestProject.due_date
          ? format(new Date(closestProject.due_date), 'yyyy-MM-dd hh:mm')
          : null,
        project_id: closestProject.project_id,
      }
    },
  },
  methods: {
    handleClick() {
      this.$router.push(
        `remediation-projects/${this.closestDeadlineProject.project_id}`,
      )
    },
  },
}
</script>

<template>
  <v-card class="mt-2 d-flex align-center" height="95px">
    <v-card-text
      v-if="
        !closestDeadlineProject.project_id && remediationProjects.length > 0
      "
      class="text-center text-body-1"
    >
      {{ $t('projectManagement.remediationProject.noClosestDeadline') }}
    </v-card-text>
    <v-card-text
      v-else-if="remediationProjects.length > 0"
      class="text-center text-body-1"
    >
      <i18n
        tag="p"
        path="projectManagement.remediationProject.closest_deadline"
      >
        <template #project_id>
          <v-chip class="mb-1" label @click="handleClick">
            {{
              remediationProjectIdPrefix + closestDeadlineProject.project_id
            }}
          </v-chip>
        </template>
        <template #due_date>
          <v-chip>{{ closestDeadlineProject.due_date }}</v-chip>
        </template>
      </i18n>
    </v-card-text>
    <v-card-text v-else class="text-center text-body-1">
      {{ $t('projectManagement.noProject') }}
    </v-card-text>
  </v-card>
</template>
