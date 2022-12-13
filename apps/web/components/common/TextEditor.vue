<script>
// @ts-check
// @ts-expect-error
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    QuillEditor: quillEditor,
  },
  data() {
    return {
      content: '',
      editorOptions: {
        // Some Quill options...
      }
    }
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
  methods: {
    /**
     * @param {{html: string, text: string, quill: any}} quillEvent
     */
    onContentChange(quillEvent) {
      this.content = quillEvent.html

      if (this.withoutHtml)
        this.$emit('change-content', quillEvent.text)
      else
        this.$emit('change-content', quillEvent.html)
    },
  },
}
</script>

<template>
  <QuillEditor
    :content="content"
    :options="editorOptions"
    @change="onContentChange($event)"
  />
</template>
