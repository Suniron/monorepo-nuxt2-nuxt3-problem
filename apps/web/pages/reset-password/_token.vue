<script setup lang="ts">
import { useContext, useRouter } from '@nuxtjs/composition-api'
import { ref } from 'vue'
import PasswordPolicyTooltipWrapper from '~/components/users/PasswordPolicyTooltipWrapper.vue'
import { updatePasswordByToken } from '~/services/auth'
import { PASSWORD_VALIDATION_REGEXP } from '~/utils/users.utils'

const router = useRouter()
const axios = useContext().$axios

const failMessage = ref('')
const isLoading = ref(false)

const userPassword = ref('')

// TODO: replace by vee-validate
const rules = {
  complexity: [
    (v: string) => {
      if (/* isEdit &&  */v === '')
        return true

      return PASSWORD_VALIDATION_REGEXP.test(v)
    },
  ],
  required: (v: string) => !!v || 'This field is required',
}

const submitForm = async () => {
  try {
    isLoading.value = true
    const res = await updatePasswordByToken(axios, {
      password: userPassword.value,
      token: router.currentRoute.params.token,
    })
    if (res.status === 200) {
      router.push('/sign-in')
      isLoading.value = false
    // this.failMessage = ''
    }
    else {
      // this.failMessage = this.$t('error.resetPasswordFailed')
    }
  }
  catch (error) {
    console.error(error)
  }
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
            <PasswordPolicyTooltipWrapper :password="userPassword">
              <v-text-field
                v-model="userPassword"
                :rules="rules.complexity"
                label="Password"
                type="password"
                required
              />
            </PasswordPolicyTooltipWrapper>
            <v-btn
              type="submit"
              class="text-center mt-4 green--text"
              @click="submitForm"
            >
              Reset password
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
