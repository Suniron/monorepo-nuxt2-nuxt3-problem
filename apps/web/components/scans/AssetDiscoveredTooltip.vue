<script>
export default {
  props: {
    asset: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <div>
    <span v-if="asset.ips.length">
      <strong>IP: </strong>{{ asset.ips.toString() }}
    </span>
    <span v-if="asset.hostname">
      <strong>Hostname: </strong>{{ asset.hostname }}
    </span>
    <span v-if="asset.url"><strong>URL: </strong>{{ asset.url }}</span>
    <span v-if="asset.mail"><strong>Mail: </strong>{{ asset.mail }}</span>
  </div>
</template>
