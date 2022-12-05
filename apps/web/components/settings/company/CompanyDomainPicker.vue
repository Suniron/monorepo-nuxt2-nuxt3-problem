<template>
  <v-col cols="auto">
    <v-select
      @change="updateCompanyWhitelistedDomain"
      v-model="selectedDomain"
      :items="availableDomains"
      item-text="name"
      item-value="id"
      placeholder="Available Domains"
    ></v-select>
    <v-snackbar
      v-model="showUpdatedCompanyDomain"
      :timeout="1500"
      color="green darken-1"
    >
      Domain updated
    </v-snackbar>
  </v-col>
</template>

<script>
import { getAvailableXratorDomains } from '~/services/phishing-scenarios-domains/index.js'
import { updateCompanyInformations } from '~/services/companies/index.js'
export default {
  data() {
    return {
      availableDomains: [],
      selectedDomain: undefined,
      showUpdatedCompanyDomain: false
    }
  },
  created() {
    this.fetchAvailableDomains()
  },
  methods: {
    async fetchAvailableDomains() {
      this.availableDomains = await getAvailableXratorDomains(this.$axios)
      this.selectedDomain = this.availableDomains.find(
        (ad) => ad.isAlreadySelected
      )
    },
    async updateCompanyWhitelistedDomain() {
      const response = await updateCompanyInformations(this.$axios, {
        selectedDomain: this.selectedDomain
      })
      if (response.status === 200) this.showUpdatedCompanyDomain = true
    }
  }
}
</script>

<style></style>
