<template>
  <v-col>
    <!-- CREATE MESSAGE -->
    <v-row v-if="!isReadOnlyMode" justify="center">
      <v-col cols="6">
        <MessageCreator title="Add a new comment" @post-message="postComment" />
      </v-col>
    </v-row>

    <!-- SHOW MESSAGE HISTORY-->
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title>Comments</v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col cols="8">
                <v-alert
                  v-if="!sortedPostsByDate.length"
                  elevation="2"
                  type="info"
                >
                  There is no messages for now.
                </v-alert>

                <v-timeline v-else dense>
                  <v-timeline-item
                    v-for="post in sortedPostsByDate"
                    :key="post.comment_id"
                  >
                    <v-card class="elevation-2" style="max-width: 400px">
                      <v-card-text class="pb-1">
                        <div class="d-flex justify-space-between">
                          <p>
                            From: <b>{{ post.user_name }}</b>
                          </p>
                          <v-tooltip top>
                            <template #activator="{ on, attrs }">
                              <span v-bind="attrs" v-on="on"
                                >{{ getDuration(post.from_date) }} ago</span
                              >
                            </template>
                            <span>{{ getFormattedDate(post.from_date) }}</span>
                          </v-tooltip>
                        </div>

                        <quill-editor
                          :content="post.comment"
                          :options="editorOptionReadOnly"
                          disabled
                          class="quill-display"
                        />

                        <p
                          v-if="post.from_status_name && !post.to_status_name"
                          class="pt-1 text-uppercase font-weight-bold"
                        >
                          <v-chip
                            label
                            :color="statusColor(post.from_status_name)"
                            >{{ post.from_status_name }}</v-chip
                          >
                        </p>

                        <p
                          v-else-if="
                            post.from_status_name && post.from_status_name
                          "
                          class="pt-1 text-uppercase font-weight-bold"
                        >
                          <v-chip
                            label
                            :color="statusColor(post.from_status_name)"
                            >{{ post.from_status_name }}</v-chip
                          >
                          <v-icon>mdi-arrow-right</v-icon>
                          <v-chip
                            label
                            :color="statusColor(post.to_status_name)"
                            >{{ post.to_status_name }}</v-chip
                          >
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
// @ts-check
/**
 * @typedef {import('@/types/remediationProject').RemediationProjectPost} RemediationProjectPost
 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// @ts-ignore
import { quillEditor } from 'vue-quill-editor'
import { mapState, mapGetters, mapActions } from 'vuex'
import { format } from 'date-fns'
import MessageCreator from '~/components/common/MessageCreator.vue'
import { createRemediationProjectPostService } from '~/services/remediation-projects'
import { statusColor } from '~/utils/color.utils'
import { getDurationFromDate } from '~/utils/date.utils'

export default {
  components: { MessageCreator, quillEditor },
  data() {
    return {
      editorOptionReadOnly: {
        modules: {
          toolbar: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      /**
       * @returns {RemediationProjectPost[]}
       */
      projectDetailsPosts: (state) =>
        state.remediationProject.projectDetails?.posts ?? [],
      /**
       * @returns {number}
       */
      projectId: (state) =>
        state.remediationProject.projectDetails?.info.project_id
    }),
    ...mapGetters('remediationProject', ['isReadOnlyMode']),
    /**
     * Filter posts by date, most recent in the top
     * @returns {RemediationProjectPost[]}
     */
    sortedPostsByDate() {
      if (!this.projectDetailsPosts) {
        return []
      }

      return [...this.projectDetailsPosts].sort(
        (a, b) =>
          new Date(b.from_date).getTime() - new Date(a.from_date).getTime()
      )
    }
  },
  methods: {
    statusColor,
    ...mapActions({
      fetchRemediationProjectDetailsPosts:
        'remediationProject/fetchRemediationProjectDetailsPosts'
    }),
    /**
     * @param {string} date
     */
    getDuration: (date) => getDurationFromDate(date),
    /**
     * @param {string} comment
     */
    async postComment(comment) {
      if (!this.projectId) {
        return
      }

      try {
        // Create post:
        await createRemediationProjectPostService(this.$axios, this.projectId, {
          comment
        })

        // Refresh posts list:
        await this.fetchRemediationProjectDetailsPosts(this.projectId)
      } catch (error) {
        // TODO: handle request error
      }
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
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
