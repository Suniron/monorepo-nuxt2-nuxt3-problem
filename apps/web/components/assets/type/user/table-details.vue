<script>
import { severityColor } from '~/utils/color.utils'
export default {
  name: 'UserTableDetails',
  data() {
    return {
      headers: [
        { text: 'Date ', value: 'vuln_publication_date' },
        { text: 'IP', value: 'ip' },
        { text: 'Localization ', value: 'details' },
        { text: 'Severity ', value: 'severity' },
        { text: 'Status ', value: 'status' },
        { text: 'Custom Description', value: 'custom_description' },
        { text: 'Custom Remediation', value: 'custom_remediation' }
      ],
      isSaveModalOpen: false,
      item: {}
    }
  },
  methods: {
    severityColor,
    toHtml(details) {
      if (details) {
        return details
          .replaceAll('\n', '<br />')
          .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
      }
    },
  },
  props: {
    asset: {
      required: true,
      type: Object,
    },
    details: {
      required: true,
      type: Array,
    },
  },
}
</script>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="details"
      :items-per-page="30"
      class="elevation-1 ellipsis"
    >
      <template #[`item.severity`]="{ item: itemSev }">
        <v-chip :color="severityColor(itemSev.severity)" dark>
          {{ itemSev.severity }}
        </v-chip>
      </template>
      <template #[`item.details`]="{ item: itemDets }">
        <p class="details-cell" v-html="toHtml(itemDets.details)" />
      </template>
      <template #[`item.status`]="{ item: itemStat }">
        <v-chip small>
          {{ itemStat.status || 'Open' }}
          <v-icon small right>
            mdi-file-document-edit-outline
          </v-icon>
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<style lang="scss">
.details-cell {
  overflow-y: auto;
  max-height: 400px;
  max-width: 600px;
}
</style>
