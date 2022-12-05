<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Update' : 'Add' }} user</v-card-title>
    <v-card-subtitle class="mb-1">
      This form allows you to {{ isEdit ? 'edit' : 'add' }} a new user to your
      company
    </v-card-subtitle>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-container>
          <h4>User infos</h4>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                v-model="firstName"
                label="First name*"
                :rules="[rules.required]"
                :disabled="isLoading"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                v-model="lastName"
                label="Last name*"
                :rules="[rules.required]"
                :disabled="isLoading"
              />
            </v-col>
          </v-row>

          <v-text-field
            outlined
            v-model="username"
            label="Username*"
            :rules="[rules.required]"
            :disabled="isLoading"
            :error="existingUsername.exist"
            :error-messages="
              existingUsername.exist ? existingUsername.error : null
            "
            @change="checkExistingUsername"
          />
          <v-text-field
            outlined
            v-model="email"
            label="Email*"
            :rules="[rules.required, rules.email]"
            :disabled="isLoading"
            :error="existingEmail.exist"
            :error-messages="existingEmail.exist ? existingEmail.error : null"
            @change="checkExistingEmail"
          />

          <h4>User password</h4>
          <v-row>
            <v-col cols="12" md="6">
              <PasswordPolicyTooltipWrapper :password="password">
                <v-text-field
                  outlined
                  v-model="password"
                  type="password"
                  :label="isEdit ? 'Password' : 'Password*'"
                  :rules="rules.complexity"
                  :disabled="isLoading"
                />
              </PasswordPolicyTooltipWrapper>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                outlined
                v-model="password2"
                type="password"
                :label="isEdit ? 'Confirm password' : 'Confirm password*'"
                :rules="rules.new"
                :disabled="isLoading"
              />
            </v-col>
          </v-row>

          <h4>User roles</h4>
          <v-select
            outlined
            v-model="role"
            :items="roleOptions"
            :rules="[rules.required]"
            :disabled="isLoading"
          />

          <v-alert type="error" v-if="error">
            {{ error }}
          </v-alert>

          <v-alert type="info" outlined dense>
            All fields with * must be filled
          </v-alert>
        </v-container>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="isLoading" @click="close">Cancel</v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid || isLoading"
        @click="createOrUpdateUser"
      >
        {{ isEdit ? 'Update' : 'Add' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// @ts-check
// Services
import {
  createUserService,
  searchUsersService,
  updateUserService
} from '~/services/users'
import { PASSWORD_VALIDATION_REGEXP } from '~/utils/users.utils'
import PasswordPolicyTooltipWrapper from '~/components/users/PasswordPolicyTooltipWrapper.vue'

export default {
  name: 'CreateUserModal',
  components: {
    PasswordPolicyTooltipWrapper
  },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      error: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      role: 'member',
      roleOptions: [
        { text: 'Admin', value: 'admin' },
        { text: 'Member', value: 'member' }
      ],
      isFormValid: false,
      isLoading: false,
      existingUsername: {
        exist: false,
        error: 'Username already exists'
      },
      existingEmail: {
        exist: false,
        error: 'Email already exists'
      },
      text: `Password must meet complexity requirement<br>
            must contains one digit from 0-9<br>
            must contains one lowercase characters<br>
            must contains one uppercase characters<br>
            must contains one special symbols in the list "@#$%"<br>
            length at least 8 characters and maximum of 40`,
      rules: {
        required: (v) => !!v || 'This field is required',
        email: (v) =>
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v) ||
          'E-mail must be valid',
        complexity: [
          (v) => {
            if (this.isEdit && v === '') {
              return true
            }
            return PASSWORD_VALIDATION_REGEXP.test(v)
          }
        ],
        new: [
          (v) => {
            if (this.isEdit && v === '') {
              return true
            }
            return this.password2 === this.password || "Password doesn't match"
          }
        ]
      },
      show: false
    }
  },
  computed: {
    /**
     * @returns {boolean}
     */
    isEdit() {
      return Boolean(this.user)
    }
  },
  watch: {
    user() {
      this.resetForm()
    }
  },
  mounted() {
    this.resetForm()
  },
  methods: {
    /**
     * @param {string} username
     */
    async checkExistingUsername(username) {
      // TODO: rewrite this to stop using 404 error as a way to check if username exists
      try {
        const result = await searchUsersService(this.$axios, { username })
        this.existingUsername.exist =
          result.users.filter((user) => user.id !== this.user?.id).length > 0
      } catch (e) {
        if (e.response?.status === 404) {
          this.existingUsername.exist = false
        } else {
          console.log(e)
        }
      }
    },
    /**
     * @param {string} email
     */
    async checkExistingEmail(email) {
      // TODO: rewrite this to stop using 404 error as a way to check if email exists
      try {
        const results = await searchUsersService(this.$axios, { email })

        this.existingEmail.exist =
          results.users.filter((user) => user.id !== this.user?.id).length > 0
      } catch (e) {
        if (e.response?.status === 404) {
          this.existingEmail.exist = false
        } else {
          console.log(e)
        }
      }
    },
    resetForm() {
      if (this.isEdit) {
        this.firstName = this.user.firstName
        this.lastName = this.user.lastName
        this.username = this.user.username
        this.email = this.user.email
        this.role = this.user.roles[0] ?? 'member'
      } else {
        this.firstName = ''
        this.lastName = ''
        this.username = ''
        this.email = ''
        this.role = 'member'
      }

      // For both edit and create mode:
      this.existingUsername.exist = false
      this.existingEmail.exist = false
      this.error = ''
      this.password = ''
      this.password2 = ''
      this.isFormValid = this.isEdit
    },
    close() {
      this.resetForm()
      this.$refs.form.resetValidation()
      this.$emit('close')
    },
    async createOrUpdateUser() {
      if (this.password !== this.password2) {
        this.error = "Password doesn't match"
        return
      }
      if (!this.$refs.form.validate()) return

      try {
        this.isLoading = true

        const { firstName, lastName, username, email, password, role } = this
        const params = { firstName, lastName, username, email, password, role }

        let res = null

        if (this.isEdit) {
          params.id = this.user.id
          params.roles = this.user.roles
          if (this.password) {
            params.password1 = this.password
            params.password2 = this.password2
          }
          res = await updateUserService(this.$axios, params)
        } else {
          res = await createUserService(this.$axios, params)
        }

        if (res) {
          this.$emit('created')
          this.close()
        } else {
          this.error = 'Something wrong happened'
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
