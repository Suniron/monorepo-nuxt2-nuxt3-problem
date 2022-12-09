<script>
// Services
import { createGroupService, updateGroupService } from '~/services/groups'

export default {
  name: 'CreateGroupModal',
  data() {
    return {
      error: '',
      name: '',
      memberIds: [],
      isFormValid: false,
      isLoading: false,
      rules: {
        required: (v) => !!v || 'This field is required'
      }
    }
  },
  computed: {
    isEdit() {
      return Boolean(this.group)
    },
  },
  watch: {
    group() {
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
    async createOrUpdateGroup() {
      if (!this.$refs.form.validate())
        return

      if (
        this.groups.find(x => x.name === this.name && x.id !== this.group?.id)
      ) {
        this.error = 'This group name already exists'
        return
      }

      try {
        this.isLoading = true

        const { name, memberIds } = this
        const params = { memberIds, name }

        if (this.isEdit)
          await updateGroupService(this.$axios, this.group.id, params)
        else
          await createGroupService(this.$axios, params)

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
    resetForm() {
      if (this.isEdit) {
        this.name = this.group.name
        this.memberIds.splice(
          0,
          this.memberIds.length,
          ...this.group.members.map(member => member.id),
        )
      }
      else {
        this.name = ''
        this.memberIds = []
      }
      this.error = ''
      this.isFormValid = this.isEdit
    },
  },
  props: {
    group: {
      default: null,
      type: Object,
    },
    groups: {
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
    <v-card-title>{{ isEdit ? 'Update' : 'Add' }} team</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                label="Team name"
                :rules="[rules.required]"
                :disabled="isLoading"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="memberIds"
                :items="users"
                item-text="firstName"
                item-value="id"
                chips
                deletable-chips
                multiple
                placeholder="Select members"
                :disabled="isLoading"
              />
            </v-col>
            <v-col v-if="error" cols="12" style="color: red;font-weight: bold">
              {{ error }}
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
        @click="createOrUpdateGroup"
      >
        {{ isEdit ? 'Update' : 'Add' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
