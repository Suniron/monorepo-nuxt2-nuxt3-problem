<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.url"
        label="URL"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.language"
        label="Source code language"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
  </div>
</template>
<script>
export default {
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
  data() {
    return {
      formData: {
        url: this.asset?.url || null,
        language: this.asset?.language || null
      }
    }
  },
  created() {
    this.$root.$on('canceledSaves', this.canceledSaves)
    this.$emit('change', this.formData)
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    canceledSaves() {
      this.formData = {
        url: this.asset?.url || null,
        language: this.asset?.language || null
      }
      this.changed()
    }
  }
}
</script>
