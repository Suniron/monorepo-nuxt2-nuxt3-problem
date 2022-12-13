<script>
import { fetchPhishingScenarioService } from '~/services/scans'

export default {
  created() {
    this.fetchPhishingScenarios()
  },
  data() {
    return {
      formData: {
        scenario: null
      },
      scenarios: [],
      rules: {
        notEmpty: [
          (v) => Boolean(this.formData.scenario) || 'You must select a scenario'
        ]
      }
    }
  },
  methods: {
    async fetchPhishingScenarios() {
      this.scenarios = await fetchPhishingScenarioService(this.$axios)
    },
    validateScenarios() {
      this.$emit('validateScenarios', this.formData.scenario)
    },
  },
}
</script>

<template>
  <v-autocomplete
    v-model="formData.scenario"
    :items="scenarios"
    item-text="name"
    item-value="id"
    label="List of scenarios"
    :rules="rules.notEmpty"
    solo
    chips
    deletable-chips
    @change="validateScenarios"
  >
    <template #item="{ item }">
      {{ item.name }} <v-subheader>{{ item.description }}</v-subheader>
    </template>
  </v-autocomplete>
</template>
