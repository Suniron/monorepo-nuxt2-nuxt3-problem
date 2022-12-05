<template>
  <div>
    <!-- IF REMEDIATION PROJECT ALREADY CANCELED -->
    <v-alert dense v-if="isProjectCanceled" type="warning" outlined>
      Projet canceled by <b>{{ cancellerUsername }}</b> at
      <b>{{ getFormattedDate(cancelDate) }}</b>
    </v-alert>

    <!-- IF REMEDIATION PROJECT CAN BE CANCELED -->
    <v-dialog
      v-else-if="isUserOwner && cancelStatusTransition"
      v-model="showCancelDialog"
      width="500"
    >
      <template #activator="{ on, attrs }">
        <v-btn color="error" v-bind="attrs" v-on="on">cancel project</v-btn>
      </template>

      <v-card>
        <v-card-title>Cancel the remediation project?</v-card-title>
        <v-card-text>
          <h2>Please, add a justification</h2>
          <TextEditor @change-content="updateJustfification" />
        </v-card-text>
        <v-card-subtitle>
          <v-alert type="error" color="warning">
            This action is <b>irreversible</b>.
          </v-alert>
        </v-card-subtitle>
        <v-card-actions class="justify-end">
          <v-btn @click="showCancelDialog = false">Go back</v-btn>
          <v-btn color="error" outlined @click="cancelProject">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ts-check
import { mapState, mapGetters, mapActions } from 'vuex'
// @ts-ignore
import { format } from 'date-fns'
import TextEditor from '~/components/common/TextEditor.vue'
import {
  createRemediationProjectPostService,
  updateRemediationProjectService
} from '~/services/remediation-projects'

export default {
  components: { TextEditor },
  props: {
    /**
     * @type {import('vue').PropOptions<import('~/types/remediationProject').StatusTransition>}
     */
    cancelStatusTransition: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showCancelDialog: false,
      justificationText: ''
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {import('~/types/store/remediationProject/remediationProjectState').RemediationProjectDetails}
       */
      projectDetails: (state) => state.remediationProject.projectDetails
    }),
    ...mapState('user', { userId: 'id' }),
    ...mapGetters('remediationProject', [
      'getProjectDetailsStatusHistorySortedByDate',
      'isUserOwner'
    ]),
    /**
     * @returns {boolean}
     */
    isProjectCanceled() {
      return this.projectDetails.info?.status === 'canceled'
    },
    /**
     * @returns {string}
     */
    cancellerUsername() {
      if (!this.getProjectDetailsStatusHistorySortedByDate?.length) {
        return ''
      }

      return this.getProjectDetailsStatusHistorySortedByDate[0].user_name
    },
    /**
     * @returns {string}
     */
    cancelDate() {
      if (!this.getProjectDetailsStatusHistorySortedByDate?.length) {
        return ''
      }

      return this.getProjectDetailsStatusHistorySortedByDate[0].from_date
    },
    /**
     * @returns {number?}
     */
    projectId() {
      // @ts-ignore
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions('remediationProject', ['fetchRemediationProjectDetails']),
    /**
     * @returns {Promise<void>}
     */
    async cancelProject() {
      if (!this.projectId) {
        return
      }

      try {
        // Change status in remediation project:
        const {
          data: { status_history_id: projectStatusHistoryId }
        } = await updateRemediationProjectService(this.$axios, this.projectId, {
          status_id: this.cancelStatusTransition.to_status_id
        })

        // Add comment
        if (this.justificationText) {
          await createRemediationProjectPostService(
            this.$axios,
            this.projectId,
            {
              comment: this.justificationText,
              projectStatusHistoryId
            }
          )
        }

        // Refresh store datas:
        await this.fetchRemediationProjectDetails(this.projectId)
      } catch (error) {
        // TODO: handle request error
      }

      this.showCancelDialog = false
    },
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
    },
    /**
     * @param {string} newText
     */
    updateJustfification(newText) {
      this.justificationText = newText
    }
  }
}
</script>
