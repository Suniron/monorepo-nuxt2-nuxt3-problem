<script>
// @ts-check
// Libs
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Services
import { loginService } from '~/services/auth'

export default {
  computed: {
    ...mapGetters('user', ['isLoggedWithCredentials', 'isFullyConnected', 'wrongLogin']),
  },
  created() {
    if (!this.isLoggedWithCredentials)
      this.$store.dispatch('changePageTitle', this.$t('action.login'))
    this.redirectIfLoggedIn()
  },
  emits: ['goToForgotPassword', 'twoFactorNeeded'],
  layout: 'no-nav-bar',
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
      showBadCredentialsSnackbar: false,
      showErrorSnackbar: false,
    }
  },
  methods: {
    ...mapActions('user', ['authorize', 'updateLoginState']),
    ...mapMutations(['CREATE_SESSION', 'WRONG_LOGIN']),
    async login() {
      try {
        if (!this.$refs['login-form']?.validate())
          return
        this.isLoading = true
        const { username, password } = this.loginForm
        const { accessToken, user, is2faInitialized } = await loginService(this.$axios, {
          password,
          username,
        })

        this.authorize({
          accessToken,
          user,
        })

        // If the user is fully connected, follow redirection (only if he have a 2fa bypass in bdd)
        if (this.isFullyConnected) {
          const redirectUrl = new URL(location.href).searchParams.get('redirect')
          if (!redirectUrl)
            return this.$router.push('/dashboard')

          this.$router.push(decodeURIComponent(redirectUrl))
          return
        }
        // If 2fa is not initialized, redirect to twoFactorNeeded init
        else if (!is2faInitialized) {
          this.$emit('twoFactorNeeded', 'init')
          return
        }
        // Else, only verify twoFactorNeeded
        this.$emit('twoFactorNeeded', 'verify')
      }
      catch (error) {
        if (error.message.includes('code 401')) {
          this.showBadCredentialsSnackbar = true
          return
        }

        this.showErrorSnackbar = true
        console.log(error)
      }
      finally {
        this.isLoading = false
      }
    },
    redirectIfLoggedIn() {
      const redirectUrl = new URL(location.href).searchParams.get('redirect')
      if (redirectUrl) {
        return this.$router.push(decodeURIComponent(redirectUrl))
      }
      else {
        return this.$router.push(this.localePath({
          name: 'dashboard',
        }))
      }
    },
    /**
         * @return {void}
         */
    submitForm() {
      this.login()
    },
  },
  watch: {
    /**
         * @param {boolean} becomeConnected - True if user is now connected
         * @param {boolean} _wasConnected - True if user was connected
         */
    isLoggedWithCredentials(becomeConnected, _wasConnected) {
      if (!becomeConnected)
        return
      this.redirectIfLoggedIn()
    },
  },
}
</script>

<template>
  <v-card style="position: relative" class="mx-auto" max-width="470" color="card-bg">
    <template #progress>
      <v-progress-linear style="position: absolute" color="#1ab342" height="5" indeterminate />
    </template>
    <v-card-title>
      {{
        $t('action.login')
      }}
    </v-card-title>

    <v-card-text class="mt-5">
      <v-form ref="login-form" v-model="loginForm.valid" @keypress.enter="submit" @submit.prevent="submitForm">
        <v-text-field
          v-model="loginForm.username" v-test="'login-form-username'" :rules="rules.username"
          :label="$t('t.usernameOrEmail')" autocomplete="username" required
        />
        <v-text-field
          v-model="loginForm.password" v-test="'login-form-password'" :rules="rules.password"
          :label="$t('t.password')" type="password" autocomplete="current-password" required
        />
        <div
          class="blue--text text-right text-decoration-underline" style="cursor: pointer"
          @click="$emit('goToForgotPassword')"
        >
          {{ $t('t.forgotYourPassword') }}
        </div>

        <div class="text-right mt-4">
          <v-btn v-test="'login-form-login-btn'" type="submit">
            {{ $t('action.login') }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>

    <!-- == NOTIFICATIONS == -->
    <!-- Credentials error -->
    <v-snackbar v-model="showBadCredentialsSnackbar" color="warning">
      Your credentials are not valid ❌
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showBadCredentialsSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Server error -->
    <v-snackbar v-model="showErrorSnackbar" text color="error">
      An error occurred on the server, please contact us.
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showErrorSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
