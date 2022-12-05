<template>
  <v-container>
    <WorldMap />
  </v-container>
</template>

<script>
// @ts-check
import WorldMap from '~/components/world-map/'

export default {
  components: {
    WorldMap
  },
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'World Map')
  }
}
</script>
