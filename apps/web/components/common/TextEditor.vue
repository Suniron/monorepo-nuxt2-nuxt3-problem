<template>
  <quill-editor
    :content="content"
    @change="onContentChange($event)"
    :options="editorOptions"
  />
</template>

<script>
// @ts-check
// @ts-ignore
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  props: {
    /**
     * If true, the output will be **HTML format** in format (by default). Otherwise, it will be in **plain text**.
     */
    withoutHtml: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      editorOptions: {
        // Some Quill options...
      }
    }
  },
  methods: {
    /**
     * @param {{html: string, text: string, quill: any}} quillEvent
     */
    onContentChange(quillEvent) {
      this.content = quillEvent.html

      if (this.withoutHtml) {
        this.$emit('change-content', quillEvent.text)
      } else {
        this.$emit('change-content', quillEvent.html)
      }
    }
  }
}
</script>
