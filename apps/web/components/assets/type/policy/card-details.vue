<template>
  <div>
    <div class="my-4">
      <span
        ><v-icon left>mdi-card-account-details-outline</v-icon
        ><strong>Name:</strong> {{ asset.name }}</span
      >
    </div>
    <div class="my-4">
      <span
        ><v-icon left>mdi-git</v-icon><strong>revision:</strong>
        {{ asset.revision || 'NA' }}</span
      >
    </div>
    <div class="my-4">
      <span
        ><v-icon left>mdi-calendar-range</v-icon><strong>date:</strong>
        {{ renderDate() }}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  methods: {
    renderDate() {
      if (this.asset.rev_cdate) {
        const date = new Date(this.asset.rev_cdate)
        return date.toISOString().split('T')[0]
      } else return 'NA'
    }
  }
}
</script>
