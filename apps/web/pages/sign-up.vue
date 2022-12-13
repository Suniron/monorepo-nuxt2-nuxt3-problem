<script>
export default {
  layout: 'no-nav-bar',
  name: 'SignupPage',
  data: () => ({
    isLoading: false,
    showErrorSnackbard: false,
    signupForm: {
      email: '',
      password: '',
      confPassword: ''
    }
  }),
  created() {
    this.$store.dispatch('changePageTitle', this.$t('action.signup'))
  },
  methods: {
    async signup() {
      // await console.log('signing up')
    },
  },
}
</script>

<template>
  <v-container class="signup">
    <v-row>
      <v-col>
        <v-card :loading="isLoading" class="mt-10 mx-auto" max-width="470">
          <v-card-title>{{ $t('action.signup') }}</v-card-title>

          <v-card-text class="mt-5">
            <v-form ref="login-form" v-model="signupForm.valid">
              <v-text-field
                v-model="signupForm.email"
                :label="$t('t.email')"
                required
              />
              <v-text-field
                v-model="signupForm.password"
                :label="$t('t.password')"
                type="password"
                required
              />
              <v-text-field
                v-model="signupForm.confPassword"
                :label="$t('t.confirmPassword')"
                type="password"
                required
              />

              <div class="text-right mt-4">
                <v-btn @click="signup">
                  {{ $t('action.signup') }}
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
      Signup unsuccessful. Please try again.
    </v-snackbar>
  </v-container>
</template>

<style lang="scss" scoped></style>
