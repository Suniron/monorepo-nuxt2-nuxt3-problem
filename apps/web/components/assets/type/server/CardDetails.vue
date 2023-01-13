<script setup lang="ts">
import { computed, ref } from 'vue'
import { useContext } from '@nuxtjs/composition-api'
import {
  updateIpService,
} from '~/services/ips'

const { asset } = defineProps({
  asset: { required: true, type: Object },
})

const showFailMainIpSnackbar = ref(false)

/**
 * Get only the first main ip of the asset
 */
const mainIp = computed(() => {
  if (!asset.mainIps?.length || !asset.mainIps[0].address)
    return

  return asset.mainIps[0].address
})

/**
 * All other ips of the asset (remove the main ip)
 */
const otherIps = computed(() => {
  if (!asset.ips.length)
    return []
  return [...asset.ips].filter(ip => ip.address !== mainIp.value).map(ip => ip.address)
})
const axios = useContext().$axios
const updateMainIp = async (ipSelected: any) => {
  if (ipSelected) {
    ipSelected.isMain = 'true'
    try {
      const res = await updateIpService(axios, ipSelected)
      if (res.status === 204)
        asset.mainIps = [ipSelected]
    }
    catch (e) {
      showFailMainIpSnackbar.value = true
    }
  }
}
</script>

<template>
  <div>
    <p><b>Name:</b> {{ asset.name }}</p>
    <p>
      <b>Main IP:</b> <span :class="{ 'text-warning': !mainIp }">{{ mainIp ?? 'No main IP' }}
      </span>
      <span v-if="otherIps.length" class="tooltip tooltip-info z-1" :data-tip="`Other ips: ${otherIps.join(', ')}`">
        <span class="badge badge-info">
          +{{ otherIps.length }}
        </span>
      </span>
    </p>
    <div v-if="!mainIp && otherIps.length > 0">
      <div class="dropdown dropdown-hover" @click.stop>
        <label tabindex="0" class="btn btn-outline btn-xs">Change main IP</label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li v-for="ip in asset.ips">
            <a @click.stop="updateMainIp(ip)">{{ ip.address }}</a>
          </li>
        </ul>
      </div>
      <br></br>
      <v-snackbar
        v-model="showFailMainIpSnackbar"
        text
        color="error"
      >
        Something went wrong
        <template #action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="showFailMainIpSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <p><b>Operating System:</b> {{ asset.os }}</p>
    <p>
      <b>Hostname:</b>
      <span :class="{ 'text-gray-400': !asset.hostname }">{{ asset.hostname ?? 'N/A' }}</span>
    </p>
  </div>
</template>
