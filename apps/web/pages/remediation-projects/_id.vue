<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <!-- STATS / KEY INFORMATIONS -->
        <RemediationProjectStats />

        <!-- PROJECT CONTENT -->
        <RemediationProjectContent />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ts-check
import { mapActions } from 'vuex'
import RemediationProjectStats from '~/components/remediation-project/remediation-project-edition/remediation-project-stats/index.vue'
import RemediationProjectContent from '~/components/remediation-project/remediation-project-edition/remediation-project-content/index.vue'

export default {
  components: {
    RemediationProjectContent,
    RemediationProjectStats
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Remediation Project')
    // @ts-ignore
    if (!this.$route.params.id || isNaN(this.$route.params.id)) {
      // @ts-ignore
      this.$nuxt.error({ statusCode: 400 })
    }
  },
  async mounted() {
    try {
      // @ts-ignore
      await this.fetchRemediationProjectDetails(this.$route.params.id)
    } catch (error) {
      // Handle store error (like bad remediation project id)
      // @ts-ignore
      this.$nuxt.error({ statusCode: 400 })
    }
  },
  methods: {
    ...mapActions('remediationProject', ['fetchRemediationProjectDetails'])
  }
}
</script>
{ }
