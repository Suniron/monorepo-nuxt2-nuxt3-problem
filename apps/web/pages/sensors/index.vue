<script>
import ProbeInfo from '~/components/probes/probe-info.vue'

import { searchProbesService } from '~/services/probes'

export default {
  components: { ProbeInfo },
  name: 'AgentPage',
  middleware: ['auth'],
  data() {
    return {
      probes: [],
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
    },
  },
}
</script>

<template>
  <v-data-iterator :items="probes" hide-default-footer>
    <template #default="{ items }">
      <v-row v-for="(item, i) in items" :key="i" style="margin-top: 30px;">
        <v-col cols="12" lg="1" />
        <v-col cols="12" lg="10">
          <ProbeInfo :probe="item" @changed="fetchProbes" />
        </v-col>
        <v-col cols="12" lg="1" />
      </v-row>
    </template>
  </v-data-iterator>
</template>

<style lang="scss"></style>
