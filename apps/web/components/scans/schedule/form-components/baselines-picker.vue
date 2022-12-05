<template>
  <v-select
    v-model="formData.baselines"
    :items="baselines"
    item-text="text"
    item-value="value"
    label="List of baselines"
    :rules="rules.notEmpty"
    solo
    multiple
    chips
    deletable-chips
    @change="validateBaselines"
  />
</template>

<script>
import { fetchBaselinesService } from '~/services/scans'

export default {
  data() {
    return {
      formData: {
        baselines: []
      },
      baselines: [],
      rules: {
        notEmpty: [
          (v) =>
            v.length !== 0 ? true : 'You must select at least one baseline'
        ]
      }
    }
  },
  created() {
    this.fetchBaselines()
  },
  methods: {
    async fetchBaselines() {
      this.baselines = await fetchBaselinesService()
    },
    validateBaselines() {
      this.$emit('validateBaselines', this.formData.baselines)
    }
  }
}
</script>
