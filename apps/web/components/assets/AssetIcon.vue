<template>
  <span>
    <v-img
      class="mx-auto"
      v-if="icon"
      contain
      :src="icon.src"
      :alt="icon.alt"
      :width="size || icon.width"
      :height="size || icon.height"
    />
    <v-icon v-else-if="size && size <= 20" x-small class="mx-auto">
      mdi-server</v-icon
    >
    <v-icon v-else-if="20 > size && size <= 30" class="mx-auto">
      mdi-server</v-icon
    >
    <v-icon v-else x-large class="mx-auto">mdi-server</v-icon>
  </span>
</template>
<script>
import { getAssetIcons } from '~/assets/img/icons'

export default {
  props: {
    os: {
      type: String,
      default: 'server'
    },
    size: {
      type: Number,
      default: 75
    }
  },
  data() {
    return {
      icons: getAssetIcons()
    }
  },
  computed: {
    icon() {
      return this.os ? this.icons[this.os.toLowerCase()] : null
    }
  }
}
</script>
