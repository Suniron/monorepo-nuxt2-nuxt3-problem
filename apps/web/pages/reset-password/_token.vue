<script>
import PasswordPolicyTooltipWrapper from '~/components/users/PasswordPolicyTooltipWrapper.vue'
import { updatePasswordByToken } from '~/services/auth'
import { PASSWORD_VALIDATION_REGEXP } from '~/utils/users.utils'
export default {
  components: { PasswordPolicyTooltipWrapper },
  name: 'ResetPasswordPage',
  data() {
    return {
      failMessage: '',
      isLoading: false,
      loginForm: {
        password: '',
        valid: false,
      },
      rules: {
        complexity: [
          (v) => {
            if (this.isEdit && v === '')
              return true

            return PASSWORD_VALIDATION_REGEXP.test(v)
          },
        ],
        required: v => !!v || 'This field is required',
      },
    }
  },
  methods: {
    async submitForm() {
      try {
        this.isLoading = true
        const { password } = this.loginForm
        const res = await updatePasswordByToken(this.$axios, {
          password,
          token: this.$route.params.token,
        })
        if (res.status === 200) {
          this.$router.push('/sign-in')
          this.isLoading = false
          this.failMessage = ''
        }
        else {
          this.failMessage = this.$t('error.resetPasswordFailed')
        }
      }
      catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<template>
  <v-container class="login">
    <v-row>
      <v-col>
        <v-card
          :loading="isLoading"
          class="mt-10 mx-auto"
          max-width="470"
          color="card-bg"
        >
          <v-card-text class="mt-5">
            <PasswordPolicyTooltipWrapper :password="loginForm.password">
              <v-text-field
                v-model="loginForm.password"
                :rules="rules.complexity"
                :label="$t('t.password')"
                type="password"
                required
              />
            </PasswordPolicyTooltipWrapper>
            <v-btn
              type="submit"
              class="text-center mt-4 green--text"
              @click="submitForm"
            >
              {{ $t('action.resetPassword') }}
            </v-btn>
            <div v-if="failMessage" class="text-center mt-4 red--text">
              {{ failMessage }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss"></style>
