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
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="4">
            <v-file-input
              v-model="scan"
              v-if="scanItem !== ''"
              :rules="rules.required"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" lg="2">
            <v-checkbox
              v-if="scanItem !== ''"
              v-model="inCy"
              label="Populate cartography"
              @change="fetchCy"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" lg="4" v-if="inCy === true">
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
              @click="parseResult"
              :disabled="!isFormValid"
              :loading="isLoading"
            >
              Upload
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>
<script>
import { parseScanResult } from '~/services/scans'
import { fetchCartographiesService } from '~/services/cartography'

export default {
  data() {
    return {
      scanItems: [
        { text: 'Openvas', value: 'openvas' },
        { text: 'Nessus', value: 'nessus' },
        { text: 'Nessus Hardening', value: 'hardening' },
        { text: 'Nmap', value: 'nmap' },
        { text: 'Bloodhound', value: 'bloodhound' },
        { text: 'PingCastle', value: 'pingcastle' }
      ],
      rules: {
        required: [(v) => !!v || 'Field is required']
      },
      scanItem: '',
      name: '',
      scan: null,
      isLoading: false,
      isFormValid: false,
      inCy: false,
      cy: [],
      selectedCy: null
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
    }
  }
}
</script>
