<script>
import { parseScanResult } from '~/services/scans'
import { fetchCartographiesService } from '~/services/cartography'

export default {
  data() {
    return {
      cy: [],
      inCy: false,
      isFormValid: false,
      isLoading: false,
      name: '',
      rules: {
        required: [v => !!v || 'Field is required'],
      },
      scan: null,
      scanItem: '',
      scanItems: [
        { text: 'Openvas', value: 'openvas' },
        { text: 'Nessus', value: 'nessus' },
        { text: 'Nessus Hardening', value: 'hardening' },
        { text: 'Nmap', value: 'nmap' },
        { text: 'Bloodhound', value: 'bloodhound' },
        { text: 'PingCastle', value: 'pingcastle' },
      ],
      selectedCy: null,
    }
  },
  methods: {
    async fetchCy() {
      if (this.inCy) {
        const cy = await fetchCartographiesService(this.$axios)
        this.cy = cy
      }
    },
    async parseResult() {
      const fileData = new FormData()
      fileData.append('scanName', this.name)
      fileData.append('type', this.scanItem)
      fileData.append('files', new Blob([this.scan], { type: 'text/xml' }))
      if (this.inCy) {
        fileData.append('addToCy', true)
        fileData.append('cyId', this.selectedCy)
      }
      // fileData.append('files', this.scan)
      await parseScanResult(this.$axios, fileData)
      this.$emit('change')
      this.$emit('close')
    },
  },
}
</script>

<template>
  <v-form v-model="isFormValid">
    <v-card>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" lg="4">
            <v-text-field
              v-model="name"
              placeholder="Scan import name"
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="4">
            <v-select
              v-model="scanItem"
              :items="scanItems"
              item-text="text"
              item-value="value"
              placeholder="Choose Scan type to import"
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="4">
            <v-file-input
              v-if="scanItem !== ''"
              v-model="scan"
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="2">
            <v-checkbox
              v-if="scanItem !== ''"
              v-model="inCy"
              label="Populate cartography"
              @change="fetchCy"
            />
          </v-col>
          <v-col v-if="inCy === true" cols="12" lg="4">
            <v-select
              v-model="selectedCy"
              :items="cy"
              item-text="name"
              item-value="id"
              placeholder="New carto will be created if none is selected"
            />
          </v-col>
        </v-row>
        <v-row v-if="scanItem !== ''">
          <v-col>
            <v-btn class="mr-2" :disabled="isLoading" @click="$emit('close')">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!isFormValid"
              :loading="isLoading"
              @click="parseResult"
            >
              Upload
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>
