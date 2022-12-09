<script>
import ProjectOverdue from '~/components/remediation-project/remediation-project-list/summary-stats/ProjectOverdue.vue'
import ClosestDeadline from '~/components/remediation-project/remediation-project-list/summary-stats/ClosestDeadline.vue'
import ProjectsByStatus from '~/components/remediation-project/remediation-project-list/summary-stats/ProjectsByStatus.vue'

export default {
  components: {
    ClosestDeadline,
    ProjectOverdue,
    ProjectsByStatus,
  },
}
</script>

<template>
  <v-row justify="center">
    <v-col cols="10">
      <v-container class="d-flex justify-center stats">
        <div class="stats-box">
          <ProjectOverdue />
          <ClosestDeadline />
        </div>
        <div class="project-status">
          <ProjectsByStatus />
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
.stats {
  gap: 1%;
}
.project-status {
  width: 50%;
}
.stats-box {
  width: 50%;
}
</style>
