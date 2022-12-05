<template>
  <v-col cols="12">
    <v-tabs v-model="tab" show-arrows>
      <v-tab>Revision History</v-tab>
      <v-tab>Details</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="px-5">
      <v-tab-item>
        <asset-revisions :asset="asset" />
      </v-tab-item>
      <v-tab-item>
        <asset-details-form :asset="asset" @saved="$emit('saved')" />
      </v-tab-item>
    </v-tabs-items>
  </v-col>
</template>
<script>
import AssetRevisions from '~/components/assets/details/revisions'
import AssetDetailsForm from '~/components/assets/details/asset-details.vue'

export default {
  components: {
    AssetRevisions,
    AssetDetailsForm
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: null
    }
  }
}
</script>
