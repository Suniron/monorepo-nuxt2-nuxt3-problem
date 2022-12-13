<script>
export default {
  methods: {
    fetchLocation() {
      const result = this.asset.relations.filter((elt) => {
        return elt.type === 'LOCATED_TO'
      })
      if (result.length === 1) return result[0].name
      else return 'NA'
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <div>
    <div class="my-4">
      <span><v-icon left>mdi-card-account-details-outline</v-icon><strong>Name:</strong> {{ asset.name }}</span>
    </div>
    <div class="my-4">
      <span><v-icon left>mdi-graph-outline</v-icon><strong>Job title:</strong>
        {{ asset.position || 'NA' }}</span>
    </div>
    <div class="my-4">
      <span><v-icon left>mdi-email-open-outline</v-icon><strong>mail:</strong>
        {{ asset.mail || 'NA' }}</span>
    </div>
    <div class="my-4">
      <span><v-icon left>mdi-cellphone-text</v-icon><strong>tel:</strong>
        {{ asset.tel || 'NA' }}</span>
    </div>
    <div class="my-4">
      <span><v-icon left>mdi-map-marker-radius</v-icon><strong>location:</strong>
        {{ fetchLocation() }}</span>
    </div>
  </div>
</template>
