<template>
  <v-col cols="12">
    <v-tabs v-model="tab" show-arrows>
      <v-tab>Users</v-tab>
      <v-tab>Business units</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="px-5">
      <v-tab-item>
        <AssetRelationsList :asset="asset" children />
      </v-tab-item>
      <v-tab-item>
        <AssetRelationsList :asset="asset" parents />
      </v-tab-item>
    </v-tabs-items>
  </v-col>
</template>
<script>
// @ts-check
import AssetRelationsList from '~/components/assets/details/AssetRelationsList.vue'

export default {
  components: {
    AssetRelationsList
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: 0
    }
  }
}
</script>
