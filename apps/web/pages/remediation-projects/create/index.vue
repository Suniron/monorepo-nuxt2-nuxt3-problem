<script>
// @ts-check
import RemediationProjectEdition from '@/components/remediation-project/RemediationProjectEdition.vue'

export default {
  components: {
    RemediationProjectEdition
  },
  name: 'RemediationProjectEditionPage',
  middleware: ['auth'],
  created() {
    this.$store.dispatch('changePageTitle', 'Create new Remediation Project')
  },
}
</script>

<template>
  <div style="width: 90vw" class="h-100">
    <RemediationProjectEdition is-save />
  </div>
</template>
