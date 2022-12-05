<template>
  <v-card>
    <v-card-title v-if="title">{{ title }}</v-card-title>
    <v-card-text>
      <v-row justify="center">
        <v-col cols="7">
          <v-alert v-if="!messages.length" elevation="2" type="info">
            There is no messages for now.
          </v-alert>

          <v-timeline v-else dense>
            <v-timeline-item v-for="msg in sortedMessagesByDate" :key="msg.id">
              <v-card class="elevation-2" style="max-width: 400px">
                <v-card-text class="pb-1">
                  <div class="d-flex justify-space-between">
                    <p>
                      From: <b>{{ msg.author }}</b>
                    </p>
                    <p>
                      <i>{{ msg.creationDate }}</i>
                    </p>
                  </div>

                  <quill-editor
                    :content="msg.content"
                    :options="editorOptionReadOnly"
                    disabled
                    class="quill-display"
                  />
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// @ts-check
/**
 * @typedef {import('@/types/discussion').DiscussionMessage} DiscussionMessage
 */
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// @ts-ignore
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  props: {
    /**
     * Add title to the editor
     */
    title: { type: String, default: '' },
    /**
     * @type {import('vue').PropOptions<DiscussionMessage[]>} */
    messages: { type: Array, default: () => [], required: true }
  },
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
    /**
     * @returns {DiscussionMessage[]} Messages sorted recent to older
     */
    sortedMessagesByDate() {
      const msgs = [...this.messages]
      return msgs.sort(
        (a, b) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      )
    }
  }
}
</script>
