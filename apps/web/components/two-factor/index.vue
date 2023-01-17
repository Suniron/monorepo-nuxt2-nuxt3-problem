<script setup lang="ts">
import { ref, useContext } from '@nuxtjs/composition-api'
import TwoFactorInit from './Init.vue'
import TwoFactorVerify from './Verify.vue'
import BaseCard from '~/components/base/Card.vue'
import BaseNote from '~/components/base/Note.vue'
import { logoutService } from '~/services/auth'

const props = defineProps<{
  mode: 'init' | 'verify'
}>()

const { $axios: axios, store } = useContext()

const currentMode = ref(props.mode)

const handleLogout = async () => {
  await logoutService(axios)
  store.dispatch('user/deauthorize')
}
</script>

<template>
  <BaseCard class="shadow-none sm:shadow-md">
    <div class="flex justify-between">
      <h2 class="card-title">
        Two factor authentication
      </h2>

      <button class="btn btn-ghost btn-circle" title="Go to credentials screen" @click="handleLogout">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
      </button>
    </div>

    <div class="card-body">
      <TwoFactorInit v-if="currentMode === 'init'" @initialized="currentMode = 'verify'" />

      <TwoFactorVerify v-else />
    </div>

    <BaseNote class="text-center">
      <a class="underline" href="mailto:support@x-rator.com">Contact our support</a>
    </BaseNote>
  </BaseCard>
</template>
