<template>
  <v-row align="center" justify="center" class="mt-4">
    <v-col cols="12" lg="6">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form v-model="isFormValid">
            <v-row justify="center">
              <v-col cols="12" lg="4">
                <v-text-field
                  disabled
                  v-model="form.email"
                  placeholder="Email"
                  label="Email"
                ></v-text-field>
              </v-col>

              <v-col cols="12" lg="4">
                <v-text-field
                  disabled
                  v-model="form.username"
                  placeholder="Username"
                  label="username"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" lg="4">
                <v-text-field
                  v-model="form.firstName"
                  placeholder="First Name"
                  label="First Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  v-model="form.lastName"
                  placeholder="Last Name"
                  label="Last Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" lg="4">
                <v-text-field
                  v-model="form.oldPassword"
                  :rules="rules.default"
                  label="Old password"
                  type="password"
                  required
                />
              </v-col>
              <v-col cols="12" lg="4"> </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" lg="4">
                <PasswordPolicyTooltipWrapper :password="form.password1">
                  <v-text-field
                    v-model="form.password1"
                    :rules="rules.complexity"
                    label="type new password"
                    type="password"
                    required
                  />
                </PasswordPolicyTooltipWrapper>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  v-model="form.password2"
                  :rules="rules.new"
                  label="re-type password"
                  type="password"
                  required
                />
              </v-col>
            </v-row>
            <v-row justify="end" align="end">
              <v-col>
                <v-btn
                  color="primary"
                  @click.stop="save"
                  :disabled="!isFormValid"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                style="color: red;font-weight: bold"
                v-if="error"
              >
                {{ form.errorMessage }}
              </v-col>
              <v-col
                cols="12"
                style="color: green;font-weight: bold"
                v-else-if="success"
              >
                {{ form.successMessage }}
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { updateUserService } from '@/services/users'
import { PASSWORD_VALIDATION_REGEXP } from '@/utils/users.utils'
import PasswordPolicyTooltipWrapper from '~/components/users/PasswordPolicyTooltipWrapper.vue'

export default {
  components: { PasswordPolicyTooltipWrapper },
  middleware: ['auth'],
  data() {
    return {
      form: {
        errorMessage: 'Wrong password',
        successMessage: 'Profile updated',
        firstName: '',
        lastName: '',
        oldPassword: '',
        password1: '',
        password2: '',
        email: ''
      },
      error: false,
      success: false,
      isFormValid: false,
      isLoading: false,
      showOld: false,
      text: `Password must meet complexity requirement<br>
            must contains one digit from 0-9<br>
            must contains one lowercase characters<br>
            must contains one uppercase characters<br>
            must contains one special symbols<br>
            length at least 8 characters and maximum of 40`,
      showNew: true,
      rules: {
        default: [
          (v) => {
            this.restToolTips()
            return !!v || 'Field is required'
          }
        ],
        complexity: [
          (v) => {
            this.restToolTips()
            if (!PASSWORD_VALIDATION_REGEXP.test(v)) {
              this.showNew = true
              return false
            } else return true
          }
        ],
        new: [
          (v) => {
            this.restToolTips()
            return (
              this.form.password2 === this.form.password1 ||
              "Password doesn't match"
            )
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', [
      'isLoggedIn',
      'firstName',
      'lastName',
      'id',
      'username',
      'email'
    ])
    /* rules() {
      const rules = []
      if (this.form.password2 !== '') {
        const rule = (v) => {
          this.restToolTips()
          return (
            this.form.password2 === this.form.password1 ||
            "Password doesn't match"
          )
        }
        rules.push(rule)
      } else if (this.form.password1 !== '') {
        const rule = (v) => {
          this.restToolTips()
          if (!/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{8,40})/.test(v)) {
            this.showNew = true
            return false
          } else return true
        }
        rules.push(rule)
      }
        const rule = (v) => {
          this.restToolTips()
          return !!v || 'Field is required'
        }
        rules.push(rule)
      return rules
    } */
  },
  created() {
    this.form.firstName = this.firstName
    this.form.lastName = this.lastName
    this.form.username = this.username
    this.form.email = this.email
  },
  methods: {
    ...mapActions('user', ['changeUserValueAfterUpdate']),
    async save() {
      this.error = false
      this.success = false
      const params = {
        id: this.id,
        ...this.form
      }
      const result = await updateUserService(this.$axios, params)

      if (result.id && result.firstName && result.lastName) {
        this.changeUserValueAfterUpdate({
          user: {
            firstName: result.firstName,
            lastName: result.lastName
          }
        })
        this.success = true
      } else {
        this.error = true
      }
    },
    restToolTips() {
      this.showOld = false
      this.showNew = false
    }
  }
}
</script>
