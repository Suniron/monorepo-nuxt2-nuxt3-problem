<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import { statusColor } from '~/utils/color.utils'

/**
 * @typedef {import('~/types/remediationProject').RemediationProjectSummary & {
 *  isOwner: boolean
 * }} assignment
 */

export default {
  data: () => ({
    statusColor,
    /**
     * @type {{
     *  ownedProjects: import('~/types/remediationProject').RemediationProjectSummary[],
     *  assignedProjects: import('~/types/remediationProject').RemediationProjectSummary[],
     * }}
     */
    assignments: {
      ownedProjects: [],
      assignedProjects: []
    }
  }),
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {string}
       */
      remediationProjectIdPrefix: state =>
        state.remediationProject.remediationProjectIdPrefix,
    }),
    /**
     * @returns {assignment[]}
     */
    projects() {
      const assigneeProjects = _.cloneDeep(this.data?.assignee ?? []).map(
        (project) => {
          project.isOwner = false
          return project
        },
      )
      const ownerProjects = _.cloneDeep(this.data?.owner ?? []).map(
        (project) => {
          project.isOwner = true
          return project
        },
      )
      /**
       * @type {assignment[]}
       */
      const allProjects = [...assigneeProjects, ...ownerProjects]
      return allProjects.sort((project1, project2) => {
        if (project1.status_weight !== project2.status_weight)
          return project2.status_weight - project1.status_weight

        return new Date(project1.due_date) - new Date(project2.due_date)
      })
    },
  },
  methods: {
    getStatusText(status) {
      return this.$t(`projectManagement.statusLevel.${status}`)
    },
  },
}
</script>

<template>
  <v-card class="mx-auto d-flex flex-column">
    <v-card-title>
      Assigned to you<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text justify-center d-flex overflow-y-auto">
      <v-list>
        <div v-if="projects.length === 0">
          No results to display.
        </div>
        <v-list-group v-for="item in projects" :key="item.project_id" no-action>
          <template #activator>
            <v-list-item-avatar>
              <v-icon v-if="item.isOwner" title="You are this project's owner">
                mdi-shield-account
              </v-icon>
              <v-icon v-else title="You are assigned to this project">
                mdi-account
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                [{{ remediationProjectIdPrefix }}{{ item.project_id }}]
                {{ item.project_name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon align="center" justify="center">
              <v-icon
                class="my-1"
                style="filter: saturate(5)"
                :color="statusColor(item.status)"
                :title="item.status === 'overdue' ? 'Project is overdue!' : ''"
              >
                mdi-calendar-badge-outline
              </v-icon>
            </v-list-item-icon>
            <v-list-item-icon class="mx-3">
              <v-btn icon :to="`/remediation-projects/${item.project_id}`">
                <v-icon title="Go to the project's page">
                  mdi-eye
                </v-icon>
              </v-btn>
            </v-list-item-icon>
          </template>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle class="text-wrap ml-5">
                <p>
                  Project status:
                  <v-chip
                    label
                    :color="statusColor(item.status)"
                    class="text-uppercase font-weight-bold"
                  >
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </p>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                Due date: {{ item.due_date }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style>
.v-list {
  width: 100%;
}
</style>
