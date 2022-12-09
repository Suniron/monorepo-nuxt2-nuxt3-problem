<script>
// Services
import { createTagService, patchTagService } from '~/services/tags'

export default {
  name: 'CreateTagModal',
  data() {
    return {
      error: '',
      name: '',
      color: '',
      isFormValid: false,
      isLoading: false,
      rules: {
        required: (v) => !!v || 'This field is required'
      }
    }
  },
  computed: {
    /**
     * @returns {Boolean}
     */
    isEdit() {
      return Boolean(this.tag?.id)
    },
  },
  watch: {
    tag() {
      this.resetForm()
    }
  },
  created() {
    this.resetForm()
  },
  methods: {
    close() {
      this.resetForm()
      this.$refs.form.resetValidation()
      this.$emit('close')
    },
    async createOrUpdateTag() {
      if (!this.$refs.form.validate())
        return

      if (
        this.tags.find(x => x.name === this.name && x.id !== this.tag?.id)
      ) {
        this.error = 'This tag name already exists'
        return
      }

      try {
        this.isLoading = true

        const { name, color } = this
        const params = { color, name }

        if (this.isEdit)
          await patchTagService(this.$axios, this.tag.id, params)
        else
          await createTagService(this.$axios, params)

        this.$emit('created')
        this.close()
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.isLoading = false
      }
    },
    goToAsset(id) {
      this.$router.push(`/assets/${id}`)
    },
    resetForm() {
      if (this.isEdit) {
        this.name = this.tag.name
        this.color = this.tag.color
      }
      else {
        this.name = 'New Tag'
        this.color = '#909090'
      }
      this.error = ''
      this.isFormValid = this.isEdit
    },
  },
  props: {
    tag: {
      default: null,
      type: Object,
    },
    tags: {
      default: () => [],
      type: Array,
    },
    users: {
      default: () => [],
      type: Array,
    },
  },
}
</script>

<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Update' : 'Add' }} tag</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Tag name"
                :rules="[rules.required]"
                :disabled="isLoading"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-chip :color="color">
                {{ name }}
              </v-chip>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-color-picker
                v-model="color"
                placeholder="Select tag color"
                :disabled="isLoading"
              />
            </v-col>
            <v-col v-if="error" cols="12" style="color: red;font-weight: bold">
              {{ error }}
            </v-col>
          </v-row>

          <v-row v-if="tag && tag.assets">
            <v-col cols="12">
              <!-- Assets with tag -->
              <v-chip
                v-for="asset in tag.assets"
                :key="asset.id"
                class="ma-1"
                @click="goToAsset(asset.id)"
              >
                {{ asset.name }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="isLoading" @click="close">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid || isLoading"
        @click="createOrUpdateTag"
      >
        {{ isEdit ? 'Update' : 'Add' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
