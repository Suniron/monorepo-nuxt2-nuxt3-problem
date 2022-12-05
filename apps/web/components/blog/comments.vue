<template>
  <v-container fluid>
    <v-row class="space-around">
      <!-- <v-card>
        <v-card-text> -->
      <v-timeline dense clipped>
        <v-timeline-item
          fill-dot
          class="white--text mb-12"
          color="deep-purple lighten-1"
          large
        >
          <template #icon>
            <v-avatar color="deep-purple lighten-1" size="50">
              <span class="white--text text-h5">ME</span>
            </v-avatar>
          </template>
          <v-card>
            <quill-editor
              :content="content"
              :options="editorOption"
              @change="onEditorChange($event)"
            />
            <v-row>
              <v-col
                class="text-right"
                style="margin-top: 10px; margin-right: 10px"
              >
                <v-btn
                  class="mx-0"
                  depressed
                  @click="updatePost"
                  :disabled="!verifyNotEmpty()"
                >
                  Post
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-timeline-item>

        <v-timeline-item class="mb-6" hide-dot>
          <span>TODAY</span>
        </v-timeline-item>
        <v-timeline-item
          v-for="message in messages"
          :key="message.createdAt"
          color="black"
        >
          <template #icon>
            <v-avatar color="black" :size="50">
              <span class="white--text text-h5"
                >{{ message.firstName.charAt(0)
                }}{{ message.lastName.charAt(0) }}</span
              >
            </v-avatar>
          </template>
          <v-card color="black" dark>
            <v-card-title class="text-h6">
              <strong>{{ message.firstName }}</strong> @{{ message.createdAt }}
            </v-card-title>
            <v-card-text class="white text--primary">
              <quill-editor
                :content="message.comment"
                :options="editorOptionReadOnly"
                disabled
                class="quill-display"
              />
              <!--<div
                    v-html="message.message"
                    class="ql-container ql-show"
                  ></div>-->
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <!--  </v-card-text>
      </v-card> -->
    </v-row>
  </v-container>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
// import jmessages from '~/services/blog/comments.json'
import {
  searchPostAssetVulnerabilityService,
  addPostAssetVulnerabilityService
} from '~/services/vulnerabilities/status'

export default {
  components: { quillEditor },
  props: {
    assetId: {
      type: Number,
      required: true
    },
    vulnId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    messages: [],
    content: '',
    editorOption: {
      // Some Quill options...
    },
    editorOptionReadOnly: {
      modules: {
        toolbar: false
      }
    }
  }),
  created() {
    this.fetchComments()
  },
  methods: {
    async fetchComments() {
      const comments = await searchPostAssetVulnerabilityService(
        this.$axios,
        this.assetId,
        this.vulnId
      )
      this.messages = comments
    },
    onEditorChange({ quill, html, text }) {
      console.log(quill)
      this.content = html
    },
    verifyNotEmpty() {
      const regexTags = /(<[^>]+>|<[^>]>|<\/[^>]>)/g
      const contentWithoutHtml = this.content.replace(regexTags, '')
      return contentWithoutHtml.match(/\S/) || this.content.includes('src')
    },
    async updatePost() {
      await addPostAssetVulnerabilityService(
        this.$axios,
        this.assetId,
        this.vulnId,
        { comment: this.content }
      )
      this.content = ''
      this.fetchComments()
    }
  }
}
</script>
<style lang="scss">
.ql-disabled {
  border: none !important;
  outline: none;
}
</style>
