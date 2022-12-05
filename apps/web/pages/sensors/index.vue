<template>
  <v-data-iterator :items="probes" hide-default-footer>
    <template #default="{ items }">
      <v-row v-for="(item, i) in items" :key="i" style="margin-top: 30px;">
        <v-col cols="12" lg="1"></v-col>
        <v-col cols="12" lg="10">
          <probe-info @changed="fetchProbes" :probe="item" />
        </v-col>
        <v-col cols="12" lg="1"></v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import ProbeInfo from '~/components/probes/probe-info.vue'

import { searchProbesService } from '~/services/probes'

export default {
  name: 'AgentPage',
  components: { ProbeInfo },
  middleware: ['auth'],
  data() {
    return {
      probes: []
    }
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Sensors')
    this.fetchProbes()
  },
  methods: {
    async fetchProbes() {
      const temporaryProbes = await searchProbesService(this.$axios)
      this.probes = temporaryProbes.sort((a, b) => a.id - b.id)
    }
  }
}
</script>

<style lang="scss"></style>
