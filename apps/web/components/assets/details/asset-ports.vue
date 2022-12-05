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
      <p v-html="toHtml(itemDets.detail)" class="details-cell"></p>
    </template>
  </v-data-table>
</template>
<script>
import { fetchAssetsPortsService } from '@/services/assets/index'

export default {
  name: 'ServerTableDetails',
  props: {
    assetId: {
      type: Number,
      required: true
    },
    // eslint-disable-next-line vue/require-default-prop
    tabs: {
      type: Number,
      required: false
    }
  },
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
  watch: {
    // whenever tab is 3 (so we're trying to access ports tab), this function will run and fetch our ports again (we might have delete an IP)
    tabs(newTab) {
      if (newTab === 3) {
        this.fetchPorts()
      }
    }
  },
  created() {
    this.fetchPorts()
  },
  methods: {
    async fetchPorts() {
      this.details = await fetchAssetsPortsService(this.$axios, this.assetId)
      console.log(this.details)
    },
    toHtml(details) {
      if (details)
        return details
          .replaceAll('\n', '<br />')
          .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
      else return ''
    }
  }
}
</script>
<style lang="scss">
.details-cell {
  overflow-y: auto;
  max-height: 400px;
  max-width: 600px;
}
</style>
