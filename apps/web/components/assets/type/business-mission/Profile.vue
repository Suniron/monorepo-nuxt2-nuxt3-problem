<template>
  <v-row>
    <v-col cols="12" lg="6">
      <div class="asset-profile__details">
        <h3>Summary Details</h3>
        <p><strong>Name:</strong> {{ asset.name }}</p>
      </div>
    </v-col>
    <v-col cols="12" lg="6">
      <div class="asset-profile__details">
        <AssetRiskScore :asset="asset" />
      </div>
    </v-col>
  </v-row>
</template>
<script>
import AssetRiskScore from '../../details/AssetRiskScore.vue'

export default {
  name: 'BusinessMissionProfile',
  components: { AssetRiskScore },
  props: {
    asset: {
      type: Object,
      required: true
    }
  }
}
</script>
