<template>
  <v-container>
    <v-row justify="center" class="mb-4">
      <v-col cols="10">
        <div class="d-flex justify align-center">
          <v-text-field
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
            clearable
            v-model="search"
          ></v-text-field>
          <v-spacer />
          <v-btn @click="newProject" class="create-asset-btn" color="primary">
            + Create new project
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-3">
      <v-col cols="10">
        <v-data-table
          :no-data-text="$t('projectManagement.noProject')"
          :search="search"
          :headers="headers"
          :items="projectTable"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1 cursor"
          @click:row="openProjectId"
          @update:sort-by="resetDefaultSort"
          :page.sync="page"
          :loading="loading"
          :custom-sort="defaultTableSort ? dueDateSort : undefined"
        >
          <template #[`item.project_id`]="{ item }">
            <v-chip label>{{
              remediationProjectIdPrefix + item.project_id
            }}</v-chip>
          </template>
          <template #[`item.owner_name`]="{ item }">
            <v-chip @click.prevent.stop
              ><v-avatar left><v-icon>mdi-account</v-icon></v-avatar>
              {{ item.owner_name }}</v-chip
            >
          </template>
          <template #[`item.priority`]="{ item }">
            <v-chip
              @click.prevent.stop
              :color="getPriorityColor(item.priority)"
              >{{ item.priority }}</v-chip
            >
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip @click.prevent.stop :color="getStatusColor(item.status)">{{
              item.status
            }}</v-chip>
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
  data() {
    return {
      search: '',
      page: 1,
      itemsPerPage: 5,
      headers: [
        {
          text: this.$t('projectManagement.id'),
          value: 'project_id',
          align: 'center'
        },
        {
          text: this.$t('projectManagement.projectName'),
          value: 'project_name',
          align: 'center'
        },
        {
          text: this.$t('projectManagement.projectOwner'),
          value: 'owner_name',
          align: 'center'
        },
        {
          text: this.$t('projectManagement.priority'),
          value: 'priority',
          /**
           * @param {RemediationProjectPriority} a
           * @param {RemediationProjectPriority} b
           */
          sort: (a, b) => {
            return (
              this.remediationProjects.find(
                (rp) => this.priorityCodeTranslation[rp.priority] === a
              ).priority_weight -
              this.remediationProjects.find(
                (rp) => this.priorityCodeTranslation[rp.priority] === b
              ).priority_weight
            )
          },
          align: 'center'
        },
        {
          text: this.$t('projectManagement.status'),
          value: 'status',
          /**
           * @param {RemediationProjectStatus} a
           * @param {RemediationProjectStatus} b
           */
          sort: (a, b) => {
            return (
              this.remediationProjects.find(
                (rp) => this.statusCodeTranslation[rp.status] === a
              ).status_weight -
              this.remediationProjects.find(
                (rp) => this.statusCodeTranslation[rp.status] === b
              ).status_weight
            )
          },
          align: 'center'
        },
        {
          text: this.$t('projectManagement.deadline'),
          value: 'due_date',
          align: 'center'
        }
      ],
      defaultTableSort: true
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {RemediationProjectSummary[]}
       */
      remediationProjects: (state) =>
        state.remediationProject.remediationProjects,
      /**
       * @returns {string}
       */
      remediationProjectIdPrefix: (state) =>
        state.remediationProject.remediationProjectIdPrefix
    }),
    /**
     * @returns {StatusCodeTranslation}
     */
    statusCodeTranslation() {
      return {
        overdue: this.$t('projectManagement.statusLevel.overdue'),
        canceled: this.$t('projectManagement.statusLevel.canceled'),
        completed: this.$t('projectManagement.statusLevel.completed'),
        to_review: this.$t('projectManagement.statusLevel.to_review'),
        in_progress: this.$t('projectManagement.statusLevel.in_progress'),
        open: this.$t('projectManagement.statusLevel.open')
      }
    },
    /**
     * @returns {PriorityCodeTranslation}
     */
    priorityCodeTranslation() {
      return {
        low: this.$t('projectManagement.priorityLevel.low'),
        medium: this.$t('projectManagement.priorityLevel.medium'),
        high: this.$t('projectManagement.priorityLevel.high'),
        critical: this.$t('projectManagement.priorityLevel.critical')
      }
    },
    /**
     * @returns {ProjectTable[]}
     */
    projectTable() {
      return this.remediationProjects?.map((project) => {
        return {
          project_id: project.project_id,
          project_name: project.project_name,
          owner_name: project.owner_name,
          priority: this.priorityCodeTranslation[project.priority],
          status: this.statusCodeTranslation[project.status],
          due_date: format(new Date(project.due_date), 'yyyy-MM-dd hh:mm')
        }
      })
    },
    /**
     * @returns {boolean}
     */
    loading() {
      return this.remediationProjects === undefined
    }
  },
  watch: {
    itemsPerPageOptions() {
      this.itemsPerPage = this.itemsPerPageOptions[0]
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
  methods: {
    /**
     * @param {string} statusName
     * @returns {string}
     */
    getStatusColor(statusName) {
      const translatedStatus = Object.keys(this.statusCodeTranslation).find(
        (key) => this.statusCodeTranslation[key] === statusName
      )
      return statusColor(translatedStatus)
    },
    /**
     * @param {string} priorityName
     * @returns {string}
     */
    getPriorityColor(priorityName) {
      const translatedPriority = Object.keys(this.priorityCodeTranslation).find(
        (key) => this.priorityCodeTranslation[key] === priorityName
      )
      return severityColor(translatedPriority)
    },
    /**
     * Sort by closest due date
     * @param {ProjectTable[]} items
     * @returns {ProjectTable[]}
     */
    dueDateSort(items) {
      return items.sort((a, b) => {
        if (a.status === b.status) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        } else {
          return (
            ([
              this.statusCodeTranslation.completed,
              this.statusCodeTranslation.canceled
            ].includes(a.status)
              ? 1
              : 0) -
            ([
              this.statusCodeTranslation.completed,
              this.statusCodeTranslation.canceled
            ].includes(b.status)
              ? 1
              : 0)
          )
        }
      })
    },
    /**
     * @param {{page: number, pageSize: number}} pageParams
     */
    setPageParams(pageParams) {
      this.page = pageParams.page
      this.itemsPerPage = pageParams.pageSize
    },
    resetDefaultSort() {
      this.defaultTableSort = false
    },
    openProjectId(item) {
      this.$router.push(`/remediation-projects/${item.project_id}`)
    },
    newProject() {
      this.$router.push(`/remediation-projects/create`)
    }
  }
}
</script>
<style scoped>
.cursor:hover {
  cursor: pointer;
}
</style>
