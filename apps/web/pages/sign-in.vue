<template>
  <v-container class="login">
    <v-row>
      <v-col>
        <v-card
          :loading.sync="isLoading"
          style="position: relative"
          class="mx-auto"
          max-width="470"
          color="card-bg"
        >
          <template slot="progress">
            <v-progress-linear
              style="position: absolute"
              color="#1ab342"
              height="5"
              indeterminate
            ></v-progress-linear>
          </template>
          <v-card-title>{{
            toggleForgotPassword
              ? $t('action.resetPassword')
              : $t('action.login')
          }}</v-card-title>

          <v-card-text class="mt-5">
            <v-form
              @keypress.enter="submit"
              ref="login-form"
              v-model="loginForm.valid"
              @submit.prevent="submitForm"
            >
              <v-text-field
                v-test="'login-form-username'"
                v-model="loginForm.username"
                :rules="rules.username"
                :label="$t('t.usernameOrEmail')"
                required
              />
              <v-text-field
                v-test="'login-form-password'"
                v-if="!toggleForgotPassword"
                v-model="loginForm.password"
                :rules="rules.password"
                :label="$t('t.password')"
                type="password"
                required
              />
              <div
                v-if="!toggleForgotPassword"
                @click="toggleForgotPassword = true"
                class="blue--text text-right text-decoration-underline"
                style="cursor: pointer"
              >
                {{ $t('t.forgotYourPassword') }}
              </div>
              <div
                v-if="toggleForgotPassword"
                @click="
                  () => {
                    ;(toggleForgotPassword = false),
                      (failMessage = ''),
                      (message = '')
                  }
                "
                class="blue--text text-left text-decoration-underline"
                style="cursor: pointer"
              >
                {{ $t('t.ReturnToLoginPage') }}
              </div>

              <div class="text-right mt-4">
                <v-btn
                  v-if="!toggleForgotPassword"
                  v-test="'login-form-login-btn'"
                  type="submit"
                  >{{ $t('action.login') }}</v-btn
                >
                <v-btn
                  v-else
                  :disabled="isLoading"
                  v-test="'login-form-reset-password-btn'"
                  type="submit"
                  >{{ $t('action.resetPassword') }}</v-btn
                >
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

<script>
// @ts-check
// Libs
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Services
import { loginService, sendResetPasswordMail } from '~/services/auth'

export default {
  name: 'SigninPage',
  layout: 'no-nav-bar',
  data() {
    return {
      toggleForgotPassword: false,
      showEmailSentSnackbar: false,
      showFailMailSnackbar: false,
      loginForm: {
        valid: false,
        username: '',
        password: ''
      },
      rules: {
        username: [(v) => !!v || 'Username or email required'],
        password: [(v) => !!v || 'Password is required']
      },
      isLoading: false
    }
  },
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
      }
    }
  },
  watch: {
    /**
     * @param {boolean} becomeConected - True if user is now connected
     * @param {boolean} wasConnected - True if user was connected
     */
    isLoggedIn(becomeConected, _wasConnected) {
      if (!becomeConected) {
        return
      }

      this.redirectIfLoggedIn()
    }
  },
  created() {
    if (!this.isLoggedIn) {
      this.$store.dispatch('changePageTitle', this.$t('action.login'))
    }

    this.redirectIfLoggedIn()
  },
  methods: {
    ...mapActions('user', ['authorize', 'updateLoginState']),
    ...mapMutations(['CREATE_SESSION', 'WRONG_LOGIN']),
    async login() {
      try {
        if (!this.$refs['login-form'].validate()) {
          return
        }

        this.isLoading = true

        const { username, password } = this.loginForm
        const { accessToken, user } = await loginService(this.$axios, {
          username,
          password
        })
        /**
         * @return {void}
         */
        this.authorize({
          accessToken,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            roles: user.roles
          }
        })

        const redirectUrl = new URL(location.href).searchParams.get('redirect')
        if (redirectUrl) {
          this.$router.push(decodeURIComponent(redirectUrl))
        } else {
          this.$router.push('/dashboard')
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    /**
     * @return {void}
     */
    submitForm() {
      if (this.toggleForgotPassword) {
        this.resetPassword()
      } else {
        this.login()
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
          username
        })
        if (res.status === 201) {
          this.showEmailSentSnackbar = true
        } else {
          // it will be useful when we'll handle the error res. this.failMessage = this.$t('action.mailDoesntExist')
        }
      } catch (error) {
        this.showFailMailSnackbar = true
        console.error(error)
      }
      this.isLoading = false
    },
    /**
     * @return {void}
     */
    redirectIfLoggedIn() {
      const redirectUrl = new URL(location.href).searchParams.get('redirect')
      if (redirectUrl) {
        return this.$router.push(decodeURIComponent(redirectUrl))
      } else {
        return this.$router.push(
          this.localePath({
            name: 'dashboard'
          })
        )
      }
    }
  }
}
</script>
