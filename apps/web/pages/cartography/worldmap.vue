<script>
// @ts-check
import WorldMap from '~/components/world-map/'

export default {
  components: {
    WorldMap,
  },
  created() {
    this.$store.dispatch('changePageTitle', 'World Map')
  },
  middleware: ['auth']
}
</script>

<template>
  <v-container>
    <WorldMap />
  </v-container>
</template>
