<script>
// @ts-check
// Libs
import { mapGetters } from 'vuex'
// Services
import { XButton } from '@xrator/ui'
import ResetPassword from '~/components/sign-in/ResetPassword.vue'
import Login from '~/components/sign-in/Login.vue'
import TwoFactor from '~/components/two-factor/index.vue'

export default {
  components: { Login, ResetPassword, TwoFactor, XButton },
  computed: {
    ...mapGetters('user', ['isLoggedWithCredentials', 'wrongLogin', 'isFullyConnected']),
    /**
     * @returns {boolean}
     */
    showTwoFactor() {
      return !this.isFullyConnected && this.isLoggedWithCredentials
    },
  },
  created() {
    if (!this.isLoggedWithCredentials)
      this.$store.dispatch('changePageTitle', this.$t('action.login'))
    this.redirectIfLoggedIn()
  },
  data() {
    return {
      toggleForgotPassword: false,
      /**
       * @type {'init' | 'verify'}
       */
      twoFactorMode: 'init',
      twoFactorNeeded: false,
    }
  },
  layout: 'no-nav-bar',
  methods: {
    /**
     * @param {'init' | 'verify'} mode
     */
    handleTwoFactorNeeded(mode) {
      this.twoFactorNeeded = true
      this.twoFactorMode = mode
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
  },
  name: 'SignInPage',
}
</script>

<template>
  <div>
    <!-- FORGOT PASSWORD FORM -->
    <ResetPassword v-if="toggleForgotPassword" @goToLogin="toggleForgotPassword = false" />

    <!-- 2FA FORM -->
    <TwoFactor v-else-if="showTwoFactor" :mode="twoFactorMode" />

    <!-- LOGIN FORM -->
    <Login v-else @goToForgotPassword="toggleForgotPassword = true" @twoFactorNeeded="handleTwoFactorNeeded" />
    <XButton>Hello</XButton>
  </div>
</template>
