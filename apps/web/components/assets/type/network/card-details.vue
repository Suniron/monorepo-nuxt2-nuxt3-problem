<template>
  <div>
    <div class="my-4">
      <span><strong>Name:</strong> {{ asset.name }}</span>
    </div>
    <div class="my-4">
      <span
        ><strong>Network:</strong> {{ asset.network }}/{{ asset.netmask }}</span
      >
    </div>
    <div class="my-4">
      <span><strong>Gateway:</strong> {{ asset.gateway }}</span>
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
