<script>
export default {
  data() {
    return {
      formData: {
        url: this.asset?.url || null,
        language: this.asset?.language || null
      }
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    quickedit: {
      type: Boolean,
      required: false
    }
  },
  created() {
    this.$root.$on('resetForm', this.resetForm)
    this.$emit('change', this.formData)
  },
  methods: {
    resetForm() {
      this.formData = {
        language: this.asset?.language || null,
        url: this.asset?.url || null,
      }
      this.changed()
    },
    changed() {
      this.$emit('change', this.formData)
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.url"
        label="URL"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.language"
        label="Source code language"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
  </div>
</template>
