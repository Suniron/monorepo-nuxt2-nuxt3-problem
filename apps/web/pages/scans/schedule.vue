<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Schedule a scan</v-card-title>
          <v-card-text>
            <schedule-form />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ScheduleForm from '~/components/scans/schedule/schedule-form'

export default {
  name: 'ScheduleScanPage',
  components: {
    ScheduleForm
  },
  middleware: ['auth'],
  data() {
    return {
      activeTab: 0
    }
  }
}
</script>

<style></style>
