<script>
import ScheduleForm from '~/components/scans/schedule/schedule-form'

export default {
  components: {
    ScheduleForm
  },
  name: 'ScheduleScanPage',
  middleware: ['auth'],
  data() {
    return {
      activeTab: 0,
    }
  },
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Schedule a scan</v-card-title>
          <v-card-text>
            <ScheduleForm />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
