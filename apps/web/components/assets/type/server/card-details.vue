<template>
  <div>
    <div class="my-4">
      <span
        ><strong>Name:</strong>
        {{ asset.name || (asset.ip && asset.ip.address) }}</span
      >
    </div>
    <div class="my-4">
      <span
        ><strong>IP:</strong>
        {{
          (asset.ips && asset.ips.map((x) => x.address).join(', ')) || 'NA'
        }}</span
      >
    </div>
    <div v-if="asset.hostname" class="my-4">
      <span><strong>Hostname:</strong> {{ asset.hostname }}</span>
    </div>
    <div class="my-4">
      <span><strong>Operating System:</strong> {{ asset.os }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  }
}
</script>
