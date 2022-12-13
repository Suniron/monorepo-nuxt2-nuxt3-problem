<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { updateStatusVulnerability } from '~/services/vulnerabilities/status'

export default {
  components: { QuillEditor: quillEditor },
  data() {
    return {
      statusChoices: ['Open', 'Accepted', 'Remediated'],
      select: null,
      editorOption: {},
      isLoading: false,
      isFormValid: false,
      form: {
        updated: this.vulnerability.status || 'Open',
        comment: ''
      }
    }
  },
  props: {
    vulnerability: {
      type: Object,
      default: null
    },
    vulnerabilities: {
      type: Array,
      default: null
    },
    assetId: {
      type: Number,
      required: true
    }
  },
  created() {
    this.select = this.displayStatus()
    this.form.updated = this.select
  },
  methods: {
    displayStatus(details) {
      let open = false
      let accepted = false
      let closed = false
      let status = ''

      const element = details?.[0] ?? this.vulnerability

      if (!element.status || element.status.toLowerCase() === 'open')
        open = true
      else if (element.status.toLowerCase() === 'accepted')
        accepted = true
      else if (element.status.toLowerCase() === 'remediated')
        closed = true

      if (open && accepted && closed)
        status = 'Open, Accepted & Remediated'
      else if (open && accepted)
        status = 'Open & Accepted'
      else if (open && closed)
        status = 'Open & Remediated'
      else if (accepted && closed)
        status = 'Accepted & Remediated'
      else if (open)
        status = 'Open'
      else if (accepted)
        status = 'Accepted'
      else status = 'Remediated'
      return status
    },
    onChange($event) {
      if (
        this.statusChoices.includes(this.form.updated)
        && this.vulnerability.status !== this.form.updated
      )
        this.isFormValid = true
      else this.isFormValid = false
    },
    onEditorChange({ quill, html, text }) {
      this.form.comment = html
    },
    async saveStatus() {
      try {
        this.isLoading = true
        const { updated, comment } = this.form
        if (this.vulnerabilities) {
          for (const elt in this.vulnerabilities) {
            console.log(this.vulnerabilities[elt])
            await updateStatusVulnerability(
              this.$axios,
              this.assetId,
              this.vulnerabilities[elt].vast_id,
              {
                comment,
                updated,
              },
            )
          }
        }
        else if (this.vulnerability.status !== this.form.updated) {
          await updateStatusVulnerability(
            this.$axios,
            this.assetId,
            this.vulnerability.vast_id,
            {
              comment,
              updated,
            },
          )
          // this.$emit('saved')
        }
        this.isFormValid = false
        this.$root.$emit('fetchDataAgain')
        this.$emit('close')
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <v-card class="save-status-modal">
    <v-card-title>
      <p>
        Update status
        <span v-if="vulnerabilities">for all affected IP and Ports </span> on
        <br>{{ vulnerability.name }}
      </p>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-select
              v-model="form.updated"
              :items="statusChoices"
              label="Vulnerability status"
              @change="onChange($event)"
            />
          </v-row>
          <v-row style="height: 30px" />
          <v-row>
            <p>Add supportive evidence:</p>
          </v-row>
          <v-row>
            <v-container fill-height>
              <QuillEditor
                v-model="form.comment"
                :content="form.comment"
                :options="editorOption"
                @change="onEditorChange($event)"
              />
            </v-container>
          </v-row>
          <v-row>
            <v-col class="actions">
              <v-btn
                class="mr-2"
                :disabled="isLoading"
                @click.stop="$emit('close')"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!isFormValid"
                :loading="isLoading"
                @click.stop="saveStatus"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.save-status-modal {
  .actions {
    display: flex;
    justify-content: flex-end;
  }
}
.editor-node {
  height: auto;
}
.v-dialog .ql-container {
  overflow-y: auto;
  min-height: 100%;
  height: 180px;
}
</style>
