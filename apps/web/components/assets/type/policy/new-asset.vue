<script>
export default {
  props: {
    asset: {
      type: Object,
      required: true
    },
    isUpdate: {
      type: Boolean,
      required: false
    },
    quickedit: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      formData: {
        revision: this.asset?.revision || null,
        doc: this.asset?.doc || null,
        cdate: this.asset?.cdate || null
      },
      file: null,
      validations: {
        required: [(value) => !!value || 'Required.']
      },
      menu: false
    }
  },
  created() {
    this.$root.$on('resetForm', this.resetForm)
    this.changed()
    this.$emit('change', this.formData)
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    changedFileInformations() {
      this.$root.$emit('filesChanged', this.file)
      this.$emit('change', this.formData)
    },
    resetForm() {
      this.file = null
      this.formData = {
        cdate: this.asset?.cdate || null,
        doc: this.asset?.doc || null,
        revision: this.asset?.revision || null,
      }
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.revision"
        :rules="validations.required"
        label="Document Revision"
        :disabled="!quickedit"
        required
        @change="changed"
      />
    </v-col>
    <v-col v-if="!isUpdate" cols="12">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="formData.cdate"
            label="Creation date"
            prepend-icon="mdi-calendar"
            readonly
            :disabled="!quickedit"
            :rules="validations.required"
            v-bind="attrs"
            @change="changed"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="formData.cdate"
          @input="menu = false"
        />
      </v-menu>
    </v-col>
    <v-col v-if="!isUpdate" cols="12">
      <v-row>
        <v-col cols="12" lg="10">
          <v-file-input
            v-model="file"
            class="pt-0"
            label="Upload your document"
            :disabled="!quickedit"
            :rules="validations.required"
            @change="changedFileInformations"
            @click:clear="resetForm"
          />
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>
