<script>
// @ts-check
// Libs
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Services
import { loginService, sendResetPasswordMail } from '~/services/auth'

export default {
  layout: 'no-nav-bar',
  name: 'SigninPage',
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'wrongLogin']),
    /**
     * @return {string}
     */
    showErrorSnackbard: {
      /**
       * @return {string}
       */
      get() {
        return this.wrongLogin
      },
      /**
       * @param {string} value
       */
      set(value) {
        this.updateLoginState(value)
      },
    },
  },
  created() {
    if (!this.isLoggedIn)
      this.$store.dispatch('changePageTitle', this.$t('action.login'))

    this.redirectIfLoggedIn()
  },
  data() {
    return {
      isLoading: false,
      loginForm: {
        password: '',
        username: '',
        valid: false,
      },
      rules: {
        password: [v => !!v || 'Password is required'],
        username: [v => !!v || 'Username or email required'],
      },
      showEmailSentSnackbar: false,
      showFailMailSnackbar: false,
      toggleForgotPassword: false,
    }
  },
  methods: {
    ...mapActions('user', ['authorize', 'updateLoginState']),
    ...mapMutations(['CREATE_SESSION', 'WRONG_LOGIN']),
    async login() {
      try {
        if (!this.$refs['login-form'].validate())
          return

        this.isLoading = true

        const { username, password } = this.loginForm
        const { accessToken, user } = await loginService(this.$axios, {
          password,
          username,
        })
        /**
         * @return {void}
         */
        this.authorize({
          accessToken,
          user: {
            email: user.email,
            firstName: user.firstName,
            id: user.id,
            lastName: user.lastName,
            roles: user.roles,
            username: user.username,
          },
        })

        const redirectUrl = new URL(location.href).searchParams.get('redirect')
        if (redirectUrl)
          this.$router.push(decodeURIComponent(redirectUrl))
        else
          this.$router.push('/dashboard')
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.isLoading = false
      }
    },

    /**
     * @return {void}
     */
    redirectIfLoggedIn() {
      const redirectUrl = new URL(location.href).searchParams.get('redirect')
      if (redirectUrl) {
        return this.$router.push(decodeURIComponent(redirectUrl))
      }
      else {
        return this.$router.push(
          this.localePath({
            name: 'dashboard',
          }),
        )
      }
    },

    /**
     * @return {Promise<void>}
     */
    async resetPassword() {
      try {
        this.isLoading = true
        const { username } = this.loginForm
        const res = await sendResetPasswordMail(this.$axios, {
          username,
        })
        if (res.status === 201) {
          this.showEmailSentSnackbar = true
        }
        else {
          // it will be useful when we'll handle the error res. this.failMessage = this.$t('action.mailDoesntExist')
        }
      }
      catch (error) {
        this.showFailMailSnackbar = true
        console.error(error)
      }
      this.isLoading = false
    },

    /**
     * @return {void}
     */
    submitForm() {
      if (this.toggleForgotPassword)
        this.resetPassword()
      else
        this.login()
    },
  },
  watch: {
    /**
     * @param {boolean} becomeConected - True if user is now connected
     * @param {boolean} wasConnected - True if user was connected
     */
    isLoggedIn(becomeConected, _wasConnected) {
      if (!becomeConected)
        return

      this.redirectIfLoggedIn()
    },
  },
}
</script>

<template>
  <v-container class="login">
    <v-row>
      <v-col>
        <v-card
          v-model:loading="isLoading"
          style="position: relative"
          class="mx-auto"
          max-width="470"
          color="card-bg"
        >
          <template #progress>
            <v-progress-linear
              style="position: absolute"
              color="#1ab342"
              height="5"
              indeterminate
            />
          </template>
          <v-card-title>
            {{
              toggleForgotPassword
                ? $t('action.resetPassword')
                : $t('action.login')
            }}
          </v-card-title>

          <v-card-text class="mt-5">
            <v-form
              ref="login-form"
              v-model="loginForm.valid"
              @keypress.enter="submit"
              @submit.prevent="submitForm"
            >
              <v-text-field
                v-model="loginForm.username"
                v-test="'login-form-username'"
                :rules="rules.username"
                :label="$t('t.usernameOrEmail')"
                required
              />
              <v-text-field
                v-if="!toggleForgotPassword"
                v-model="loginForm.password"
                v-test="'login-form-password'"
                :rules="rules.password"
                :label="$t('t.password')"
                type="password"
                required
              />
              <div
                v-if="!toggleForgotPassword"
                class="blue--text text-right text-decoration-underline"
                style="cursor: pointer"
                @click="toggleForgotPassword = true"
              >
                {{ $t('t.forgotYourPassword') }}
              </div>
              <div
                v-if="toggleForgotPassword"
                class="blue--text text-left text-decoration-underline"
                style="cursor: pointer"
                @click="
                  () => {
                    ;(toggleForgotPassword = false),
                      (failMessage = ''),
                      (message = '')
                  }
                "
              >
                {{ $t('t.ReturnToLoginPage') }}
              </div>

              <div class="text-right mt-4">
                <v-btn
                  v-if="!toggleForgotPassword"
                  v-test="'login-form-login-btn'"
                  type="submit"
                >
                  {{ $t('action.login') }}
                </v-btn>
                <v-btn
                  v-else
                  v-test="'login-form-reset-password-btn'"
                  :disabled="isLoading"
                  type="submit"
                >
                  {{ $t('action.resetPassword') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showErrorSnackbard"
      :timeout="3000"
      color="red darken-1"
    >
      {{ $t('t.errorLogin') }}
    </v-snackbar>
    <v-snackbar
      v-model="showEmailSentSnackbar"
      :timeout="3000"
      color="green darken-1"
    >
      {{ $t('action.mailHasBeenSent') }}
    </v-snackbar>
    <v-snackbar
      v-model="showFailMailSnackbar"
      :timeout="3000"
      color="red darken-1"
    >
      {{ $t('action.mailDoesntExist') }}
    </v-snackbar>
  </v-container>
</template>
