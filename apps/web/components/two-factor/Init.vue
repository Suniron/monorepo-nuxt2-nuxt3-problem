<script setup lang="ts">
import { useContext } from '@nuxtjs/composition-api'
import { ref } from 'vue'
import LoadingSpinner from '../utils/LoadingSpinner.vue'
import { twoFactorSetupService } from '~/services/auth'
import BaseTextDisplay from '~/components/base/TextDisplay.vue'
import QrCode from '~/components/common/QrCode.vue'
import BaseH3 from '~/components/base/H3.vue'
import TwoFactorCodeInput from '~/components/two-factor/CodeInput.vue'

const emits = defineEmits(['initialized'])

const axios = useContext().$axios

const isLoading = ref(true)
const totpSeed = ref('')
const totpSeedUrl = ref('')

const fetchNewTotpSeed = async () => {
  try {
    const { data } = await twoFactorSetupService(axios)

    totpSeed.value = data.seed
    totpSeedUrl.value = data.seedUrl
    isLoading.value = false
  }
  catch (error: any) {
    if (error.response?.data?.message.includes('already initialized'))
      emits('initialized')
  }
}

// Init component
fetchNewTotpSeed()
</script>

<template>
  <div v-if="isLoading" class="text-center">
    <LoadingSpinner>
      is loading
    </LoadingSpinner>
  </div>

  <div v-else>
    <BaseH3>Step 1 connect your auth app</BaseH3>
    <p>Scan this QR code with your authenticator app:</p>
    <div class="flex place-content-center">
      <QrCode :content="totpSeedUrl" />
    </div>

    <div class="divider">
      OR
    </div>

    <p>Enter this code: </p>
    <BaseTextDisplay class="text-sm sm:text-base">
      {{ totpSeed }}
    </BaseTextDisplay>

    <BaseH3>Step 2 confirm your 6-digit code</BaseH3>
    <TwoFactorCodeInput />
  </div>
</template>
