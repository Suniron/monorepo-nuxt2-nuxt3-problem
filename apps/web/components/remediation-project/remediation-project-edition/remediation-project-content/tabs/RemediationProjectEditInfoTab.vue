<template>
  <v-row justify="center">
    <v-col cols="5">
      <v-card class="pb-1">
        <v-card-title>
          Update remediation project informations
        </v-card-title>

        <v-card-text class="pb-0">
          <!-- PROJECT NAME -->
          <v-text-field
            v-model="projectName"
            label="Update project name"
            outlined
          />
          <!-- PROJECT DESCRIPTION -->
          <v-textarea
            v-model="projectDescription"
            label="Update project description"
            outlined
            rows="3"
          />

          <!-- PROJECT DEADLINE DATE -->
          <v-menu
            v-model="showDatePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="projectDeadlineDate"
                label="Update project deadline date"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="projectDeadlineDate"
              @input="showDatePicker = false"
              :min="new Date().toISOString()"
            ></v-date-picker>
          </v-menu>

          <!-- PROJECT PRIORITY -->
          <v-select
            v-model="projectPriority"
            :items="availableProjectPrioritiesNames"
            label="Update project priority"
            item-text="translatedName"
            item-value="name"
            :return-object="false"
            outlined
          ></v-select>

          <!-- PROJECT OWNER -->
          <v-tooltip bottom color="warning">
            <template #activator="{ on, attrs }">
              <v-btn icon color="error" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-alert-octagram</v-icon>
              </v-btn>
            </template>
            <h4>Be careful</h4>
            <p>
              If you <u>change the owner</u>, you will
              <b>not be able to access this tab</b>.
            </p>
            <p>
              Also, you will <b>not able to participate</b> in this project if
              you are not <u>at least assigned</u>.
            </p>
          </v-tooltip>
          <v-autocomplete
            v-model="projectOwnerId"
            :items="projectAvailableAssignees"
            item-value="user_id"
            item-text="username"
            outlined
            chips
            label="Change project owner"
          >
            <template #selection="data">
              <v-chip v-bind="data.attrs" :input-value="data.user_id">
                <v-icon size="20" class="mr-1">mdi-account</v-icon>
                {{ data.item.username }}
              </v-chip>
            </template>
          </v-autocomplete>

          <!-- PROJECT ASSIGNEES -->
          <v-autocomplete
            v-model="projectAssignees"
            :items="projectAvailableAssignees"
            return-object
            item-value="user_id"
            item-text="username"
            outlined
            chips
            icon
            label="Update project assignees"
            multiple
            deletable-chips
          >
            <template #selection="data">
              <v-chip v-bind="data.attrs" :input-value="data.user_id">
                <v-icon size="20" class="mr-1">mdi-account</v-icon>
                {{ data.item.username }}
              </v-chip>
            </template></v-autocomplete
          >
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            @click="saveProjectModifications"
            >Save modifications</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// @ts-check
import { mapState, mapActions } from 'vuex'
import { format } from 'date-fns'
import _ from 'lodash'
import { updateRemediationProjectService } from '~/services/remediation-projects'
import { searchProjectPrioritiesService } from '~/services/project-priorities'
import { searchUsersService } from '~/services/users'

export default {
  data() {
    return {
      showDatePicker: false,
      availableProjectPriorities: [],
      // = PROJECT DATAS =
      projectName: null,
      projectDescription: null,
      projectDeadlineDate: null,
      projectPriority: null,
      projectOwnerId: null,
      /**
       * @type {import('~/types/user').BaseUser[]}
       */
      projectAssignees: [],
      /**
       * @type {import('~/types/user').BaseUser[]}
       */
      projectAvailableAssignees: []
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {import('~/store/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: (state) =>
        state.remediationProject.projectDetails?.info
    }),

    /**
     * @returns {{name: string, translatedName: string}[]}
     */
    availableProjectPrioritiesNames() {
      return this.availableProjectPriorities.map((priority) => ({
        name: priority.name,
        translatedName: this.$t(
          `projectManagement.priorityLevel.${priority.name}`
        )
      }))
    },
    /**
     * @returns {number}
     */
    selectedProjectPriorityId() {
      return this.availableProjectPriorities.find((priority) => {
        return priority.name === this.projectPriority
      })?.id
    },
    /**
     * @returns {boolean}
     */
    isFormValid() {
      return (
        this.projectName?.trim().length > 0 &&
        this.projectDescription?.trim().length > 0 &&
        this.projectDeadlineDate?.trim().length > 0 &&
        this.projectAssignees.length > 0 &&
        this.projectOwnerId &&
        this.projectPriority
      )
    }
  },
  watch: {
    /**
     * Update/reset form values on each state change (about remediation project infos)
     */
    projectDetailsInfo: {
      /**
       * @param {import('~/types/remediationProject').SpecificRemediationProject} newInfo
       */
      handler(newInfo) {
        this.projectName = newInfo.project_name
        this.projectDescription = newInfo.project_description
        this.projectDeadlineDate = format(
          new Date(newInfo.due_date),
          'yyyy-MM-dd'
        )
        this.projectPriority = newInfo.priority
        this.projectOwnerId = newInfo.owner_id
        this.projectAssignees = newInfo.assignees
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this.fetchAvailablePriorities()
    await this.fetchAvailableAssignees()
  },
  methods: {
    ...mapActions('remediationProject', ['fetchRemediationProjectDetailsInfo']),
    // = PROJECT DATAS =
    async saveProjectModifications() {
      const editedValues = {}

      // Project name
      if (this.projectName !== this.projectDetailsInfo.project_name) {
        editedValues.project_name = this.projectName
      }

      // Project description
      if (
        this.projectDescription !== this.projectDetailsInfo.project_description
      ) {
        editedValues.project_description = this.projectDescription
      }

      // Project deadline / due date
      if (
        new Date(this.projectDeadlineDate).getTime() !==
        new Date(this.projectDetailsInfo.due_date).getTime()
      ) {
        editedValues.due_date = new Date(this.projectDeadlineDate).toISOString()
      }

      // Project priority
      if (this.projectPriority !== this.projectDetailsInfo.priority) {
        editedValues.priority_id = this.availableProjectPriorities.find(
          (priority) => {
            return priority.name === this.projectPriority
          }
        )?.id
      }

      // Project owner
      if (this.projectOwnerId !== this.projectDetailsInfo.owner_id) {
        editedValues.owner_id = this.projectOwnerId
      }

      // Project assignees
      if (
        !_.isEqual(
          _.sortBy(this.projectAssignees),
          _.sortBy(this.projectDetailsInfo.assignees)
        )
      ) {
        editedValues.assignees = this.projectAssignees.map(
          (assignee) => assignee.user_id
        )
      }

      try {
        // Send modifications
        await updateRemediationProjectService(
          this.$axios,
          this.projectDetailsInfo.project_id,
          editedValues
        )

        // Refresh info in vuex store
        await this.fetchRemediationProjectDetailsInfo(
          this.projectDetailsInfo.project_id
        )
      } catch (error) {
        // TODO: handle request error
      }
    },
    /**
     * Get all available project priorities
     */
    async fetchAvailablePriorities() {
      try {
        this.availableProjectPriorities = await searchProjectPrioritiesService(
          this.$axios
        )
      } catch (error) {
        // TODO: handle request error
      }
    },
    /**
     * Get all available assignees
     */
    async fetchAvailableAssignees() {
      try {
        const { users } = await searchUsersService(this.$axios)
        this.projectAvailableAssignees = users.map((user) => ({
          user_id: user.id,
          username: user.username
        }))
      } catch (error) {
        // TODO: handle request error
      }
    }
  }
}
</script>
