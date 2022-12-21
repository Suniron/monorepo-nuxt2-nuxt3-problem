<script>
// @ts-check
// Libs
import { mapGetters } from 'vuex'
// Services
import ResetPassword from '~/components/sign-in/ResetPassword.vue'
import Login from '~/components/sign-in/Login.vue'

export default {
  components: { Login, ResetPassword },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'wrongLogin']),
  },
  created() {
    if (!this.isLoggedIn)
      this.$store.dispatch('changePageTitle', this.$t('action.login'))
    this.redirectIfLoggedIn()
  },
  data() {
    return {
      toggleForgotPassword: false,
    }
  },
  layout: 'no-nav-bar',
  methods: {
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
  name: 'SigninPage',
}
</script>

<template>
  <v-container class="login">
    <v-row>
      <v-col>
        <!-- FORGOT PASSWORD FORM -->
        <ResetPassword
          v-if="toggleForgotPassword"
          @goToLogin="toggleForgotPassword = false"
        />

        <!-- LOGIN FORM -->
        <Login v-else @goToForgotPassword="toggleForgotPassword = true" />
      </v-col>
    </v-row>
  </v-container>
</template>
