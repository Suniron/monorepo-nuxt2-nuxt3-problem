<script setup lang="ts">
import { computed } from 'vue'

const { asset } = defineProps({
  asset: { required: true, type: Object },
})

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
</script>

<template>
  <div>
    <p><b>Name:</b> {{ asset.name }}</p>
    <p>
      <b>Main IP:</b> <span :class="{ 'text-warning': !mainIp }">{{ mainIp ?? 'No main IP' }}</span>
      <span v-if="otherIps.length" class="tooltip tooltip-info z-10" :data-tip="`Other ips: ${otherIps.join(', ')}`">
        <span class="badge badge-info">
          +{{ otherIps.length }}
        </span>
      </span>
    </p>
    <p><b>Operating System:</b> {{ asset.os }}</p>
    <p>
      <b>Hostname:</b>
      <span :class="{ 'text-gray-400': !asset.hostname }">{{ asset.hostname ?? 'N/A' }}</span>
    </p>
  </div>
</template>
