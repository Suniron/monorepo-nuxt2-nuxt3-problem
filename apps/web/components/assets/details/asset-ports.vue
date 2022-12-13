<script>
import { fetchAssetsPortsService } from '@/services/assets/index'

export default {
  name: 'ServerTableDetails',
  data() {
    return {
      headers: [
        { text: 'Ip', value: 'address' },
        { text: 'Port', value: 'number' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Service', value: 'service' },
        { text: 'Version', value: 'version' },
        { text: 'Detail', value: 'detail' },
        { text: 'Status', value: 'status' }
      ],
      details: []
    }
  },
  created() {
    this.fetchPorts()
  },
  watch: {
    // whenever tab is 3 (so we're trying to access ports tab), this function will run and fetch our ports again (we might have delete an IP)
    tabs(newTab) {
      if (newTab === 3) 
        this.fetchPorts()
      
    },
  },
  methods: {
    async fetchPorts() {
      this.details = await fetchAssetsPortsService(this.$axios, this.assetId)
      console.log(this.details)
    },
    toHtml(details) {
      if (details) {
        return details
          .replaceAll('\n', '<br />')
          .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
      }
      else { return '' }
    },
  },
  props: {
    assetId: {
      required: true,
      type: Number,
    },

    tabs: {
      required: false,
      type: Number,
    },
  },
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="details"
    group-by="address"
    :items-per-page="30"
    class="elevation-1 ellipsis"
    show-group-by
  >
    <template #[`footer.page-text`]="items">
      {{ items.pageStart }}-{{ items.pageStop }} of
      {{ items.itemsLength }} ports
    </template>
    <template #[`item.detail`]="{ item: itemDets }">
      <p class="details-cell" v-html="toHtml(itemDets.detail)" />
    </template>
  </v-data-table>
</template>

<style lang="scss">
.details-cell {
  overflow-y: auto;
  max-height: 400px;
  max-width: 600px;
}
</style>
