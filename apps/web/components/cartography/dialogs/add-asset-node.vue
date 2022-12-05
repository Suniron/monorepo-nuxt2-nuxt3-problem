<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title>Add asset node</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Asset name"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-select v-model="form.type" :items="typeOptions" />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="close">Cancel</v-btn>
        <v-btn color="primary" :disabled="!form.name" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AddAssetNodeDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: this.value || false,
      form: {
        name: '',
        type: 'server'
      },
      rules: {
        required: (val) => !!val || 'Required'
      },
      typeOptions: [
        { text: 'Server', value: 'server' },
        { text: 'Web', value: 'web' }
      ]
    }
  },
  watch: {
    value(isOpen) {
      this.isOpen = !!isOpen
    }
  },
  methods: {
    save() {
      if (!this.$refs.form.validate()) return

      this.$emit('save', {
        name: this.form.name,
        type: this.form.type
      })
      this.close()
    },
    close() {
      this.$refs.form.resetValidation()

      this.$emit('close')
    }
  }
}
</script>
