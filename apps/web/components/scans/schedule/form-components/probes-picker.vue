<script>
import { searchProbesService } from '~/services/probes'

export default {
  data() {
    return {
      formData: {
        probe: null
      },
      probes: []
    }
  },
  props: {
    rules: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.fetchProbes()
  },
  methods: {
    async fetchProbes() {
      this.probes = await searchProbesService(this.$axios)
    },
    validateProbe() {
      this.$emit('validateProbe', this.formData.probe)
    },
  },
}
</script>

<template>
  <v-select
    v-model="formData.probe"
    placeholder="Select Probe"
    label="Select Probe"
    :items="probes"
    item-text="name"
    item-value="id"
    :rules="rules"
    solo
    @change="validateProbe"
  />
</template>
