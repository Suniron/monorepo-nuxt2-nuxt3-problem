<template>
  <v-menu offset-y v-model="isMenuOpen">
    <template #activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        Status {{ getStatusText(projectStatusName) }}
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <template v-for="(transition, transitionIndex) in transitions">
        <!-- == From "to_review" status and to "completed" / "in_progress" ... == -->
        <template
          v-if="
            transition.from_status_name === 'to_review' &&
              ['completed', 'in_progress'].includes(transition.to_status_name)
          "
        >
          <!-- ... To "completed" -->
          <template v-if="transition.to_status_name === 'completed'">
            <!-- ...If owner -->
            <TransitionListItem
              v-if="isUserOwner"
              :transition="transition"
              @click="handleAcceptReview(transition.to_status_id)"
              :key="transition.project_status_workflow_id"
            />
            <!-- ...If non owner (not handled for now)-->
          </template>
          <!-- ... To "in_progress" -->
          <template v-if="transition.to_status_name === 'in_progress'">
            <!-- ...If owner -->
            <v-dialog
              v-if="isUserOwner"
              :key="transition.project_status_workflow_id"
              v-model="showRefuseDialog"
              width="500"
            >
              <template #activator="{ on, attrs }">
                <v-list-item
                  link
                  style="cursor: pointer"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-title class="text-capitalize">{{
                    transition.transition
                  }}</v-list-item-title>
                  <v-list-item-action-text>
                    <span class="d-flex">
                      <v-icon class="ml-2">mdi-arrow-right</v-icon>
                      <v-chip
                        label
                        :style="{
                          backgroundColor: getStatusColor(
                            transition.to_status_name
                          )
                        }"
                      >
                        {{ getStatusText(transition.to_status_name) }}
                      </v-chip>
                    </span>
                  </v-list-item-action-text>
                </v-list-item>
              </template>

              <v-card>
                <v-card-title>Refuse the review</v-card-title>
                <v-card-text>
                  <h2>Please, add a justification</h2>
                  <TextEditor
                    @change-content="handleJustificationCommentChange"
                  />
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn @click="handleCancel">Cancel</v-btn>
                  <v-btn
                    color="success"
                    @click="handleRefuseReview(transition.to_status_id)"
                    >Confirm</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- ...If non owner (not handled for now)-->
            <v-list-item
              link
              style="cursor: pointer"
              v-else
              disabled
              :key="transitionIndex"
            >
              Waiting validation from {{ ownerName }}
            </v-list-item>
          </template>
        </template>

        <!-- == From "canceled" or "completed" status... == -->
        <template
          v-else-if="
            ['completed', 'canceled'].includes(transition.from_status_name)
          "
        >
          <!-- ... To "open" (= re-open in this case) -->
          <template v-if="transition.to_status_name === 'open'">
            <!-- ...If owner -->
            <v-dialog
              v-if="isUserOwner"
              v-model="showReopenDialog"
              width="500"
              :key="transition.project_status_workflow_id"
            >
              <template #activator="{ on, attrs }">
                <TransitionListItem
                  :transition="transition"
                  :bind="attrs"
                  :on="on"
                />
              </template>

              <v-card>
                <v-card-title>Re-open</v-card-title>
                <v-card-text>
                  <h2>Please, add a justification</h2>
                  <TextEditor
                    @change-content="handleJustificationCommentChange"
                  />
                  <v-menu
                    v-model="showDeadlineDatePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        class="mt-2"
                        v-model="newDeadlineDate"
                        label="Update project deadline date"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="newDeadlineDate"
                      @input="showDeadlineDatePicker = false"
                      :min="new Date().toISOString()"
                    ></v-date-picker>
                  </v-menu>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn @click="handleCancel">Cancel</v-btn>
                  <v-btn
                    :disabled="!newDeadlineDate"
                    color="success"
                    @click="handleReOpen(transition.to_status_id)"
                    >Confirm</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- ...If non-owner -->
            <v-list-item
              v-else
              link
              style="cursor: pointer"
              disabled
              :key="transitionIndex"
            >
              Ask {{ ownerName }} to re-open the project
            </v-list-item>
          </template>
        </template>

        <!-- == Other cases... == -->
        <TransitionListItem
          v-else-if="transition.to_status_name !== 'canceled'"
          :transition="transition"
          :key="transitionIndex"
          @click="handleChangeStatus(transition.to_status_id)"
        />
      </template>
    </v-list>
  </v-menu>
</template>

<script>
// @ts-check
import { mapState, mapGetters, mapActions } from 'vuex'
import TransitionListItem from './TransitionListItem.vue'
import { statusColor } from '~/utils/color.utils'
import {
  createRemediationProjectPostService,
  updateRemediationProjectService
} from '~/services/remediation-projects'
import TextEditor from '~/components/common/TextEditor.vue'

export default {
  components: { TransitionListItem, TextEditor },
  props: {
    /**
     * @type {import('vue').PropOptions<import('~/types/remediationProject').StatusTransition[]>}
     */
    transitions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      /**
       * This is needed because of a bug in Vuetify which does not close when a menu item clicked is a dialog activator
       * @see https://github.com/vuetifyjs/vuetify/issues/11521
       */
      isMenuOpen: false,
      // = Refuse modal =
      showRefuseDialog: false,
      // = Re-open modal =
      showReopenDialog: false,
      showDeadlineDatePicker: false,
      newDeadlineDate: '',
      // = All modals =
      justificationComment: ''
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {import('~/types/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: (state) =>
        state.remediationProject.projectDetails?.info
    }),
    ...mapState('user', { userId: 'id' }),
    ...mapGetters('remediationProject', [
      'getProjectDetailsStatusHistorySortedByDate',
      'isUserOwner'
    ]),
    /**
     *  @returns {import('~/types/remediationProject').RemediationProjectStatus}
     */
    projectStatusName() {
      return this.projectDetailsInfo?.status
    },
    /**
     *  @returns {number}
     */
    projectStatusId() {
      return this.projectDetailsInfo?.status_id
    },
    /**
     * Name of the owner of this remediation project
     * @returns {string}
     */
    ownerName() {
      return this.projectDetailsInfo?.owner_name
    },
    /**
     * @returns {number}
     */
    projectId() {
      // @ts-ignore
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions('remediationProject', [
      'fetchRemediationProjectDetailsInfo',
      'fetchRemediationProjectDetailsStatusHistory'
    ]),
    /**
     * @param {number} newStatusId
     */
    async handleAcceptReview(newStatusId) {
      if (!this.projectId) {
        return
      }

      try {
        // Update status in remediation project:
        await updateRemediationProjectService(this.$axios, this.projectId, {
          status_id: newStatusId
        })

        // Refresh store datas:
        await this.fetchRemediationProjectDetailsInfo(this.projectId)
        await this.fetchRemediationProjectDetailsStatusHistory(this.projectId)
      } catch (error) {
        // TODO: Handle request error
      }

      this.justificationComment = ''
    },
    /**
     * @param {number} newStatusId
     */
    async handleRefuseReview(newStatusId) {
      this.isMenuOpen = false
      if (!this.projectId) {
        return
      }

      try {
        // Update status in remediation project:
        const {
          data: { status_history_id: projectStatusHistoryId }
        } = await updateRemediationProjectService(this.$axios, this.projectId, {
          status_id: newStatusId
        })

        // Add comment:
        if (this.justificationComment) {
          await createRemediationProjectPostService(
            this.$axios,
            this.projectId,
            {
              comment: this.justificationComment,
              projectStatusHistoryId
            }
          )
        }

        // Refresh store datas:
        await this.fetchRemediationProjectDetailsInfo(this.projectId)
        await this.fetchRemediationProjectDetailsStatusHistory(this.projectId)
      } catch (error) {
        // TODO: handle request error
      }

      this.justificationComment = ''
      this.showRefuseDialog = false
    },
    /**
     * @param {number} newStatusId
     */
    async handleReOpen(newStatusId) {
      this.isMenuOpen = false
      if (!this.projectDetailsInfo || !this.newDeadlineDate) {
        return
      }

      try {
        // Update project status & deadline:
        const {
          data: { status_history_id: projectStatusHistoryId }
        } = await updateRemediationProjectService(this.$axios, this.projectId, {
          status_id: newStatusId,
          due_date: this.newDeadlineDate
        })

        // Add comment:
        if (this.justificationComment) {
          await createRemediationProjectPostService(
            this.$axios,
            this.projectId,
            {
              comment: this.justificationComment,
              projectStatusHistoryId
            }
          )
        }

        // Refresh store datas:
        await this.fetchRemediationProjectDetailsInfo(this.projectId)
        await this.fetchRemediationProjectDetailsStatusHistory(this.projectId)
      } catch (error) {
        // TODO: handle request error
      }

      this.justificationComment = ''
      this.showReopenDialog = false
    },
    handleCancel() {
      this.showRefuseDialog = false
      this.showReopenDialog = false
      this.justificationComment = ''
      this.fetchRemediationProjectDetailsInfo(this.projectId)
      this.fetchRemediationProjectDetailsStatusHistory(this.projectId)
    },
    /**
     * @param {number} newStatusId
     */
    async handleChangeStatus(newStatusId) {
      try {
        await updateRemediationProjectService(this.$axios, this.projectId, {
          status_id: newStatusId
        })

        // Refresh store datas:
        await this.fetchRemediationProjectDetailsInfo(this.projectId)
        await this.fetchRemediationProjectDetailsStatusHistory(this.projectId)
      } catch (error) {
        // TODO: handle request error
      }
    },
    /**
     * @param {import('../../RemediationProjectHistoryTab.vue').RemediationProjectStatus} status
     */
    getStatusColor: (status) => statusColor(status),
    /**
     * // TODO: replace by i18n
     *
     * @param {import('../../RemediationProjectHistoryTab.vue').RemediationProjectStatus} status
     */
    getStatusText: (status) => {
      switch (status) {
        case 'in_progress':
          return 'in progress'
        case 'to_review':
          return 'to review'
        default:
          return status
      }
    },
    /**
     * @param {string} newJustificationComment
     */
    handleJustificationCommentChange(newJustificationComment) {
      this.justificationComment = newJustificationComment
    }
  }
}
</script>
