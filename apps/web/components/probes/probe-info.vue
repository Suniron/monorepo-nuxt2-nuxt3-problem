<template>
  <v-card>
    <v-card-title
      >{{ probe.name }} (type: {{ probe.type }})<v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="1200">
        <template #activator="{ on, attrs }">
          <v-icon class="mr-6" v-on="on" v-bind="attrs">
            mdi-pen
          </v-icon>
        </template>

        <v-card-text class="mt-5 white">
          <v-form>
            <v-text-field
              v-model="newProbeNameValue"
              label="Probe name"
              required
            />
            <v-text-field label="Type" :value="probe.type" disabled />
            <div class="text-right mt-4">
              <v-btn @click="closeModal" class="">Cancel</v-btn>
              <v-btn @click="updateProbeName" class="primary">Save</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-dialog>
      <v-chip
        :color="probe.status.toLowerCase() === 'up' ? 'primary' : 'error'"
        >{{ probe.status }}</v-chip
      ></v-card-title
    >

    <v-card-text>
      <v-row>
        <v-col cols="12" lg="4">
          <p><strong>Last seen:</strong> {{ probe.cdate }}</p>
        </v-col>
        <v-col cols="12" lg="2">
          <p><strong>Exit Ip:</strong> {{ probe.exitIp }}</p>
        </v-col>
        <v-col cols="12" lg="2">
          <p>
            <strong>Internal Ip:</strong> {{ probe.address }}/{{ probe.mask }}
          </p>
        </v-col>
        <v-col cols="12" lg="2">
          <p><strong>Gateway:</strong> {{ probe.gw }}</p>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="probe.type !== 'SERVER'"
        color="primary"
        @click.stop="dlFile(probe.storeId)"
        :loading="isLoading"
        :disabled="!probe.storeId"
        download
        >DOWNLOAD</v-btn
      >
    </v-card-actions>
    <v-snackbar color="primary" v-model="showSnackbarSuccess" :timeout="3000">
      The name has been changed correctly.
    </v-snackbar>
    <v-snackbar
      color="red accent-2"
      v-model="showSnackbarError"
      :timeout="3000"
    >
      {{ error }}
    </v-snackbar>
    <v-snackbar
      color="red accent-2"
      v-model="showSnackbarDownloadProbeError"
      :timeout="3000"
    >
      {{ error }}
    </v-snackbar>
  </v-card>
</template>
<script>
import { downloadFile } from '~/services/file_upload'
import { updateProbesService } from '~/services/probes'
export default {
  props: {
    probe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      newProbeNameValue: '',
      showSnackbarSuccess: false,
      showSnackbarError: false,
      showSnackbarDownloadProbeError: false,
      error: '',
      dialog: false
    }
  },
  created() {
    this.newProbeNameValue = this.probe.name
  },
  methods: {
    async updateProbeName() {
      if (this.newProbeNameValue === this.probe.name) {
        this.closeModal()
        return
      }
      const data = await updateProbesService(this.$axios, this.probe.id, {
        name: this.newProbeNameValue
      })
      if (data.status === 204) {
        this.showSnackbarSuccess = true
        this.$emit('changed')
        this.closeModal()
      } else {
        this.error = "The name hasn't been changed. Please try again"
        this.showSnackbarError = true
      }
    },
    closeModal() {
      this.dialog = false
    },
    async dlFile(uuid) {
      this.isLoading = true
      try {
        const resp = await downloadFile(this.$axios, uuid)
        const fileUrl = window.URL.createObjectURL(new Blob([resp.data]))
        const fileLink = document.createElement('a')
        fileLink.href = fileUrl
        fileLink.setAttribute(
          'download',
          resp.headers['content-disposition'].split('=')[1]
        )
        document.body.appendChild(fileLink)
        fileLink.click()
      } catch (e) {
        this.error = `Something went wrong... (${e})`
        this.showSnackbarDownloadProbeError = true
      }
      this.isLoading = false
    }
  }
}
</script>
