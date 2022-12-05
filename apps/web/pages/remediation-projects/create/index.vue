<template>
  <div style="width: 90vw" class="h-100">
    <remediation-project-edition is-save />
  </div>
</template>

<script>
// @ts-check
import RemediationProjectEdition from '@/components/remediation-project/RemediationProjectEdition.vue'

export default {
  name: 'RemediationProjectEditionPage',
  components: {
    RemediationProjectEdition
  },
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'Create new Remediation Project')
  }
}
</script>
