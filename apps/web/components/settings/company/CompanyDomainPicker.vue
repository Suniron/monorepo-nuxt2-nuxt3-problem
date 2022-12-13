<script>
import { getAvailableXratorDomains } from '~/services/phishing-scenarios-domains/index.js'
import { updateCompanyInformations } from '~/services/companies/index.js'
export default {
  created() {
    this.fetchAvailableDomains()
  },
  data() {
    return {
      availableDomains: [],
      selectedDomain: undefined,
      showUpdatedCompanyDomain: false
    }
  },
  methods: {
    async fetchAvailableDomains() {
      this.availableDomains = await getAvailableXratorDomains(this.$axios)
      this.selectedDomain = this.availableDomains.find(
        ad => ad.isAlreadySelected,
      )
    },
    async updateCompanyWhitelistedDomain() {
      const response = await updateCompanyInformations(this.$axios, {
        selectedDomain: this.selectedDomain,
      })
      if (response.status === 200)
        this.showUpdatedCompanyDomain = true
    },
  },
}
</script>

<template>
  <v-col cols="auto">
    <v-select
      v-model="selectedDomain"
      :items="availableDomains"
      item-text="name"
      item-value="id"
      placeholder="Available Domains"
      @change="updateCompanyWhitelistedDomain"
    />
    <v-snackbar
      v-model="showUpdatedCompanyDomain"
      :timeout="1500"
      color="green darken-1"
    >
      Domain updated
    </v-snackbar>
  </v-col>
</template>

<style></style>
