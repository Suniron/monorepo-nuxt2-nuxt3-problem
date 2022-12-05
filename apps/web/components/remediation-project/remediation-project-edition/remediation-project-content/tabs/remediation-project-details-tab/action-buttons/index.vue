<template>
  <v-row class="py-5 px-8 justify-space-between" v-if="displayActionButtons">
    <!-- CANCEL BUTTON -->
    <CancelButton :cancel-status-transition="cancelTransition" />

    <!-- ACTIONS BUTTON -->
    <ChangeStatusButton :transitions="availableTransitionsWithoutCanceled" />
  </v-row>
</template>

<script>
// @ts-check
import { mapState, mapGetters } from 'vuex'
import CancelButton from './CancelButton.vue'
import ChangeStatusButton from './ChangeStatusButton.vue'
import { searchAvailableTransitionsFromStatusIdService } from '~/services/remediation-projects'

export default {
  components: { CancelButton, ChangeStatusButton },
  data() {
    return {
      /**
       * @type {import('~/types/remediationProject').StatusTransition[]}
       */
      availableTransitions: []
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {number}
       */
      projectId: (state) =>
        state.remediationProject.projectDetails?.info?.project_id,
      /**
       * @returns {import('~/types/remediationProject').RemediationProjectStatus}
       */
      projectStatus: (state) =>
        state.remediationProject.projectDetails?.info?.status,
      /**
       * @returns {number}
       */
      projectStatusId: (state) =>
        state.remediationProject.projectDetails?.info?.status_id
    }),
    ...mapGetters('remediationProject', ['isReadOnlyMode', 'isUserOwner']),
    /**
     * @returns {import('~/types/remediationProject').StatusTransition}
     */
    cancelTransition() {
      return this.availableTransitions.find(
        (transition) => transition.transition === 'cancel'
      )
    },
    /**
     * @returns {import('~/types/remediationProject').StatusTransition[]}
     */
    availableTransitionsWithoutCanceled() {
      return this.availableTransitions.filter(
        (transition) => transition.transition !== 'cancel'
      )
    },
    /**
     * @returns {boolean}
     */
    displayActionButtons() {
      if (this.isReadOnlyMode) {
        return false
      }
      if (
        !this.isUserOwner &&
        ['to_review', 'completed', 'canceled'].includes(this.projectStatus)
      ) {
        return false
      }

      return true
    }
  },
  watch: {
    /**
     * Re-fetch available transitions on project status id change
     */
    projectStatusId: {
      /**
       * @param {number} newStatusId
       */
      handler() {
        this.fetchAvailableTransitionsFromStatusId()
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.fetchAvailableTransitionsFromStatusId()
  },
  methods: {
    /**
     * Fetch available transitions for current project status
     */
    async fetchAvailableTransitionsFromStatusId() {
      if (!this.projectStatusId) {
        return
      }

      try {
        this.$set(
          this,
          'availableTransitions',
          await searchAvailableTransitionsFromStatusIdService(
            this.$axios,
            this.projectStatusId
          )
        )
      } catch (error) {
        // TODO: handle request error
      }
    }
  }
}
</script>
