<template>
  <v-data-iterator
    :items="revisions"
    :items-per-page="200"
    item-key="id"
    hide-default-footer
  >
    <template #default="{ items }">
      <v-snackbar
        :timeout="4000"
        :vertical="true"
        v-model="showDownloadFileError"
        color="error"
      >
        An error occurred while downloading the file
      </v-snackbar>

      <v-expansion-panels>
        <v-expansion-panel v-for="item of items" :key="item.revisionId">
          <v-expansion-panel-header>
            <div class="revisions-header">
              <div class="revisions-header__name">
                Revision: {{ item.revision }}
              </div>
              <v-spacer></v-spacer>
              <v-btn
                @click.stop="dlFile(item.fileUUID)"
                small
                color="primary"
                download
                icon
                outlined
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-tabs v-model="tab">
              <v-tab>Details</v-tab>
              <v-tab>Comment</v-tab>
              <v-tab>Document Controls</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-row>
                  <v-col cols="12" lg="12">
                    <div class="revisions-content">
                      <!-- Description -->
                      <template v-if="item.fileName">
                        <h4>File Name</h4>
                        <p>{{ item.fileName }}</p>
                      </template>

                      <!-- Remediation -->
                      <template v-if="item.fileSize">
                        <h4>File Size</h4>
                        <p>{{ item.fileSize }} bytes</p>
                      </template>
                      <template v-if="item.type">
                        <h4>File Type</h4>
                        <p>{{ item.fileType }}</p>
                      </template>
                      <template v-if="item.fileMd5">
                        <h4>File Integrity</h4>
                        <p>{{ item.fileMd5 }}</p>
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <comments />
              </v-tab-item>
              <v-tab-item>
                {{ item.controls }}
              </v-tab-item>
            </v-tabs-items>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-data-iterator>
</template>

<script>
// @ts-check
import comments from '~/components/blog/comments.vue'
import { startDownloadFile } from '~/services/file_upload'

export default {
  name: 'RevisionsList',
  components: { comments },
  props: {
    revisions: {
      type: Array,
      required: true
    },
    assetId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tab: null,
      showDownloadFileError: false
    }
  },
  methods: {
    toHtml(details) {
      return details
        .replaceAll('\n', '<br />')
        .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
    },
    toHtml2(details) {
      return details.replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
    },
    async dlFile(uuid) {
      try {
        await startDownloadFile(this.$axios, uuid)
      } catch (err) {
        this.showDownloadFileError = true
      }
    }
  }
}
</script>

<style lang="scss">
.revisions-header {
  display: flex;
  align-items: center;
}

.revisions-content {
  p {
    white-space: pre-wrap;
  }
}
</style>
