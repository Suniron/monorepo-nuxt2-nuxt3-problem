<script>
import { searchProbesService } from '~/services/probes'

export default {
  created() {
    this.fetchProbes()
  },
  data() {
    return {
      probes: []
    }
  },
  methods: {
    async fetchProbes() {
      this.probes = await searchProbesService(this.$axios)
    },
  },
}
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title>
      Probes Status<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text d-flex overflow-y-auto">
      <v-responsive class="overflow-y-auto">
        <v-row style="margin-top: -15px;">
          <v-col lg="5">
            Name
          </v-col>
          <v-col lg="5">
            Last seen
          </v-col>
          <v-col lg="2">
            Status
          </v-col>
        </v-row>
        <v-row v-for="(probe, i) in probes" :key="i" style="margin-top: -15px;">
          <v-col lg="5">
            <strong>{{ probe.name }}</strong>
          </v-col>
          <v-col lg="5">
            <strong>{{ probe.cdate }}</strong>
          </v-col>
          <v-col lg="2">
            <v-chip
              :color="probe.status.toLowerCase() === 'up' ? 'primary' : 'error'"
              small
            >
              {{ probe.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card-text>
  </v-card>
</template>
