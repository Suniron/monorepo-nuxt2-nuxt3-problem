<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import qrcode from 'qrcode'

const props = defineProps<{
  content: string
}>()

const qrCodeCanvasRef = ref<HTMLCanvasElement>()

const renderQrCode = () => {
  const qrCodeCanvas = qrCodeCanvasRef.value
  if (!qrCodeCanvas)
    return

  qrcode.toCanvas(qrCodeCanvas, props.content, { width: 200 }, (error) => {
    if (error)
      console.error('qrcode', error)
  })
}

// Render QR code on each content change
watch(props, () => renderQrCode(), { deep: true })

onMounted(() => {
  renderQrCode()
})
</script>

<template>
  <canvas ref="qrCodeCanvasRef" />
</template>
