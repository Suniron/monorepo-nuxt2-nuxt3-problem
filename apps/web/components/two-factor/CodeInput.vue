<script setup lang="ts">
import { useContext, useStore } from '@nuxtjs/composition-api'
import { ref } from 'vue'
import Notification from '../common/Notification.vue'
import BaseInput from '~/components/base/Input.vue'
import { loginTotpService } from '~/services/auth'

const emits = defineEmits(['success', 'error'])
const { $axios: axios, store } = useContext()

const isLoading = ref(false)
const userTotpCode = ref('')

const errorMessage = ref('')
const errorType = ref<'warning' | 'error'>('warning')

const handleSubmitCode = async (e: Event) => {
  e.preventDefault()

  // Check code conforms
  if (userTotpCode.value.length !== 6)
    return

  // Send the code
  try {
    isLoading.value = true

    const { data: { accessToken, user } } = await loginTotpService(axios, userTotpCode.value)

    console.log(store.commit)
    // Save the user and access token
    store.dispatch('user/authorize', {
      accessToken,
      user,
    })

    emits('success')
  }
  catch (error: any) {
    if (error?.response?.data?.message.includes('totp not valid')) {
      errorType.value = 'warning'
      errorMessage.value = 'The code you entered is not valid'
    }
    else {
      errorType.value = 'error'
      errorMessage.value = 'Something went wrong'
    }

    emits('error')
    // TODO: handle error
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="flex place-content-center gap-2" @submit="handleSubmitCode">
    <BaseInput v-model="userTotpCode" placeholder="6-digit code" @update:value="value => userTotpCode = value" />

    <button class="btn btn-square btn-primary" :class="{ 'btn-disabled': userTotpCode.length !== 6, 'loading': isLoading }" @click="handleSubmitCode">
      <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    </button>
    <Notification v-if="errorMessage" :type="errorType" :message="errorMessage" @close="errorMessage = ''; errorType = 'warning'" />
  </form>
</template>
