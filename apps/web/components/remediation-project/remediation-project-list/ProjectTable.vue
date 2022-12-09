<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectSummary} RemediationProjectSummary
 */
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectStatus} RemediationProjectStatus
 */
/**
 * @typedef {import('~/types/project').ProjectPriorityName} RemediationProjectPriority
 */
/**
 * @typedef {object} ProjectTable
 * @property {number} project_id - Project ID
 * @property {string} owner_name - Project owner name
 * @property {string} priority - Project priority
 * @property {string} status - Project status
 * @property {string} due_date - Project due date
 */
/**
 * Map translation for each project status code
 * @typedef {object} StatusCodeTranslation
 * @property {string} overdue
 * @property {string} canceled
 * @property {string} completed
 * @property {string} to_review
 * @property {string} in_progress
 * @property {string} open
 */
/**
 * Map translation for each project status code
 * @typedef {object} PriorityCodeTranslation
 * @property {string} low
 * @property {string} medium
 * @property {string} high
 * @property {string} critical
 */

import { mapState } from 'vuex'
import { format } from 'date-fns'
import { severityColor, statusColor } from '~/utils/color.utils'
import Pagination from '~/components/utils/Pagination.vue'

export default {
  components: { Pagination },
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
     * @returns {boolean}
     */
    loading() {
      return this.remediationProjects === undefined
    },

    /**
     * @returns {PriorityCodeTranslation}
     */
    priorityCodeTranslation() {
      return {
        critical: this.$t('projectManagement.priorityLevel.critical'),
        high: this.$t('projectManagement.priorityLevel.high'),
        low: this.$t('projectManagement.priorityLevel.low'),
        medium: this.$t('projectManagement.priorityLevel.medium'),
      }
    },

    /**
     * @returns {ProjectTable[]}
     */
    projectTable() {
      return this.remediationProjects?.map((project) => {
        return {
          due_date: format(new Date(project.due_date), 'yyyy-MM-dd hh:mm'),
          owner_name: project.owner_name,
          priority: this.priorityCodeTranslation[project.priority],
          project_id: project.project_id,
          project_name: project.project_name,
          status: this.statusCodeTranslation[project.status],
        }
      })
    },

    /**
     * @returns {StatusCodeTranslation}
     */
    statusCodeTranslation() {
      return {
        canceled: this.$t('projectManagement.statusLevel.canceled'),
        completed: this.$t('projectManagement.statusLevel.completed'),
        in_progress: this.$t('projectManagement.statusLevel.in_progress'),
        open: this.$t('projectManagement.statusLevel.open'),
        overdue: this.$t('projectManagement.statusLevel.overdue'),
        to_review: this.$t('projectManagement.statusLevel.to_review'),
      }
    },
  },
  data() {
    return {
      defaultTableSort: true,
      headers: [
        {
          align: 'center',
          text: this.$t('projectManagement.id'),
          value: 'project_id',
        },
        {
          align: 'center',
          text: this.$t('projectManagement.projectName'),
          value: 'project_name',
        },
        {
          align: 'center',
          text: this.$t('projectManagement.projectOwner'),
          value: 'owner_name',
        },
        {

          align: 'center',

          /**
           * @param {RemediationProjectPriority} a
           * @param {RemediationProjectPriority} b
           */
          sort: (a, b) => {
            return (
              this.remediationProjects.find(
                rp => this.priorityCodeTranslation[rp.priority] === a,
              ).priority_weight
              - this.remediationProjects.find(
                rp => this.priorityCodeTranslation[rp.priority] === b,
              ).priority_weight
            )
          },

          text: this.$t('projectManagement.priority'),
          value: 'priority',
        },
        {

          align: 'center',

          /**
           * @param {RemediationProjectStatus} a
           * @param {RemediationProjectStatus} b
           */
          sort: (a, b) => {
            return (
              this.remediationProjects.find(
                rp => this.statusCodeTranslation[rp.status] === a,
              ).status_weight
              - this.remediationProjects.find(
                rp => this.statusCodeTranslation[rp.status] === b,
              ).status_weight
            )
          },

          text: this.$t('projectManagement.status'),
          value: 'status',
        },
        {
          align: 'center',
          text: this.$t('projectManagement.deadline'),
          value: 'due_date',
        },
      ],
      itemsPerPage: 5,
      page: 1,
      search: '',
    }
  },
  mounted() {
    this.$root.$on('remediationProjectList:resetSort', () => {
      this.defaultTableSort = true
      this.search = ''
      this.page = 1
    })
    this.$root.$on('remediation-project-list:filter-by-status', (value) => {
      this.search = this.$t(`projectManagement.statusLevel.${value}`)
    })
  },
  watch: {
    itemsPerPageOptions() {
      this.itemsPerPage = this.itemsPerPageOptions[0]
    }
  },
  methods: {

    /**
     * Sort by closest due date
     * @param {ProjectTable[]} items
     * @returns {ProjectTable[]}
     */
    dueDateSort(items) {
      return items.sort((a, b) => {
        if (a.status === b.status) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        }
        else {
          return (
            ([
              this.statusCodeTranslation.completed,
              this.statusCodeTranslation.canceled,
            ].includes(a.status)
              ? 1
              : 0)
            - ([
              this.statusCodeTranslation.completed,
              this.statusCodeTranslation.canceled,
            ].includes(b.status)
              ? 1
              : 0)
          )
        }
      })
    },

    /**
     * @param {string} priorityName
     * @returns {string}
     */
    getPriorityColor(priorityName) {
      const translatedPriority = Object.keys(this.priorityCodeTranslation).find(
        key => this.priorityCodeTranslation[key] === priorityName,
      )
      return severityColor(translatedPriority)
    },

    /**
     * @param {string} statusName
     * @returns {string}
     */
    getStatusColor(statusName) {
      const translatedStatus = Object.keys(this.statusCodeTranslation).find(
        key => this.statusCodeTranslation[key] === statusName,
      )
      return statusColor(translatedStatus)
    },

    newProject() {
      this.$router.push('/remediation-projects/create')
    },

    openProjectId(item) {
      this.$router.push(`/remediation-projects/${item.project_id}`)
    },

    resetDefaultSort() {
      this.defaultTableSort = false
    },
    /**
     * @param {{page: number, pageSize: number}} pageParams
     */
    setPageParams(pageParams) {
      this.page = pageParams.page
      this.itemsPerPage = pageParams.pageSize
    },
  },
}
</script>

<template>
  <v-container>
    <v-row justify="center" class="mb-4">
      <v-col cols="10">
        <div class="d-flex justify align-center">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            clearable
          />
          <v-spacer />
          <v-btn class="create-asset-btn" color="primary" @click="newProject">
            + Create new project
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-3">
      <v-col cols="10">
        <v-data-table
          v-model:page="page"
          :no-data-text="$t('projectManagement.noProject')"
          :search="search"
          :headers="headers"
          :items="projectTable"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1 cursor"
          :loading="loading"
          :custom-sort="defaultTableSort ? dueDateSort : undefined"
          @click:row="openProjectId"
          @update:sort-by="resetDefaultSort"
        >
          <template #[`item.project_id`]="{ item }">
            <v-chip label>
              {{
                remediationProjectIdPrefix + item.project_id
              }}
            </v-chip>
          </template>
          <template #[`item.owner_name`]="{ item }">
            <v-chip @click.prevent.stop>
              <v-avatar left>
                <v-icon>mdi-account</v-icon>
              </v-avatar>
              {{ item.owner_name }}
            </v-chip>
          </template>
          <template #[`item.priority`]="{ item }">
            <v-chip
              :color="getPriorityColor(item.priority)"
              @click.prevent.stop
            >
              {{ item.priority }}
            </v-chip>
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" @click.prevent.stop>
              {{
                item.status
              }}
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="10">
        <Pagination
          :total-record="projectTable.length"
          select-type
          :default-page-size="itemsPerPage"
          @newPage="setPageParams"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.cursor:hover {
  cursor: pointer;
}
</style>
