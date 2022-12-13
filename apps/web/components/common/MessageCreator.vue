<script>
// @ts-check
// @ts-expect-error
import TextEditor from '~/components/common/TextEditor.vue'

export default {
  components: { TextEditor },
  data() {
    return {
      text: '',
      editorOptions: {
        // Some Quill options...
        placeholder: ''
      }
    }
  },
  props: {
    /**
     * Add title to the editor
     */
    title: { type: String, default: '' }
  },
  methods: {
    postMessage() {
      if (!this.text)
        return

      this.$emit('post-message', this.text)
    },
    /**
     * @param {string} newText
     */
    updateText(newText) {
      this.text = newText
    },
  },
}
</script>

<template>
  <v-card>
    <v-card-title v-if="title">
      {{ title }}
    </v-card-title>
    <v-card-text class="pb-0">
      <TextEditor @change-content="updateText" />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn class="my-1" color="success" @click="postMessage">
        <v-icon left>
          mdi-send
        </v-icon>Post message
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
