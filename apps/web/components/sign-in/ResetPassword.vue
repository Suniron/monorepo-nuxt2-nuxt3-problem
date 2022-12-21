<script setup lang="ts">
import { ref } from 'vue'
import { useContext } from '@nuxtjs/composition-api'
import { sendResetPasswordMail } from '~/services/auth'

const emit = defineEmits(['goToLogin'])

const axios = useContext().$axios

const isLoading = ref(false)
const isFormValid = ref(false)
const showFailMailSnackbar = ref(false)
const showEmailSentSnackbar = ref(false)
const username = ref('')

// TODO use vee-validate instead
const rules = {
  password: [(v: string) => !!v || 'Password is required'],
  username: [(v: string) => !!v || 'Username or email required'],
}

const resetPassword = async () => {
  if (!isFormValid.value || !username.value)
    return

  try {
    isLoading.value = true
    const res = await sendResetPasswordMail(axios, {
      username: username.value,
    })
    if (res.status === 201) {
      showEmailSentSnackbar.value = true
    }
    else {
      // it will be useful when we'll handle the error res. this.failMessage = this.$t('action.mailDoesntExist')
    }
  }
  catch (error) {
    showFailMailSnackbar.value = true
    console.error(error)
  }
  isLoading.value = false
}

const handleGoToLoginClick = () => {
  emit('goToLogin')
}
</script>

<template>
  <v-card
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
      Reset password
    </v-card-title>

    <v-card-text class="mt-5">
      <v-form
        ref="login-form"
        v-model="isFormValid"
        @keypress.enter="resetPassword"
        @submit.prevent="resetPassword"
      >
        <v-text-field
          v-model="username"
          v-test="'reset-form-username'"
          :rules="rules.username"
          label="Username or email"
          required
        />

        <div
          class="blue--text text-left text-decoration-underline"
          style="cursor: pointer"
          @click="handleGoToLoginClick"
        >
          Return to login
        </div>

        <div class="text-right mt-4">
          <v-btn
            v-test="'login-form-reset-password-btn'"
            :disabled="isLoading"
            type="submit"
          >
            Reset password
          </v-btn>
        </div>
      </v-form>
    </v-card-text>

    <!-- == NOTIFICATIONS == -->
    <v-snackbar
      v-model="showEmailSentSnackbar"
      color="success"
    >
      Email sent, please check your inbox to reset your password ✅
      <template #action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showEmailSentSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showFailMailSnackbar"
      text
      color="error"
    >
      Your username or email is not valid ❌
      <template #action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showFailMailSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
