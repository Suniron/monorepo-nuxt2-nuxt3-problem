<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="details"
      :items-per-page="5"
      class="elevation-1 ellipsis"
    >
      <template #[`item.severity`]="{ item: itemSev }">
        <v-chip :color="severityColor(itemSev.severity)" dark>
          {{ itemSev.severity }}
        </v-chip>
      </template>
      <template #[`item.details`]="{ item: itemDets }">
        <p
          v-if="itemDets.details"
          v-html="toHtml(itemDets.details)"
          class="details-cell"
        ></p>
        <p v-else></p>
      </template>
      <template #[`item.status`]="{ item: itemStat }">
        <v-chip small @click.stop="openModalStatus(itemStat)">
          {{ itemStat.status || 'Open' }}
          <v-icon small right>mdi-file-document-edit-outline</v-icon>
        </v-chip>
      </template>
      <template #[`item.edit`]="{ item: itemEdit }">
        <v-icon
          @click="openModalForModification(itemEdit)"
          style="cursor:pointer"
          small
          right
          >mdi-pencil</v-icon
        >
      </template>
    </v-data-table>
    <v-dialog v-model="ModalForModification" width="1500">
      <template #default>
        <update-vulnerability-form
          style="background-color:white"
          :item="item"
          :asset-id="asset.id"
          :itemvul-n="itemvulN"
        />
      </template>
    </v-dialog>
    <v-dialog v-model="ModalStatus" width="1200">
      <template #default>
        <update-status
          :vulnerability="vulnerability"
          :asset-id="asset.id"
          @close="ModalStatus = false"
        />
      </template>
    </v-dialog>
  </div>
</template>
<script>
import updateStatus from '~/components/vulnerabilities/update-status.vue'
import UpdateVulnerabilityForm from '~/components/assets/details/update-vulnerability-form.vue'
import { severityColor } from '~/utils/color.utils'

export default {
  name: 'ServerTableDetails',
  components: {
    UpdateVulnerabilityForm,
    updateStatus
  },
  props: {
    details: {
      type: Array,
      required: true
    },
    asset: {
      type: Object,
      required: true
    },
    itemvulN: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'Uri', value: 'uri' },
        { text: 'Confidence', value: 'confidence' },
        { text: 'Severity', value: 'severity' },
        { text: 'Status', value: 'status' },
        { text: 'Custom Description', value: 'custom_description' },
        { text: 'Custom Remediation', value: 'custom_remediation' },
        { text: 'Details', value: 'details' },
        { text: 'CVSS Score', value: 'cvss_score' },
        { text: 'CVSS_Code', value: 'cvss_code' },
        { text: 'Edit', value: 'edit' }
      ],
      isSaveModalOpen: false,
      ModalForModification: false,
      ModalStatus: false,
      item: {},
      vulnerability: null,
      vulnerabilities: null
    }
  },
  created() {
    this.$root.$on('ModalForModification', this.changeModalForModification)
  },
  methods: {
    changeModalForModification() {
      this.ModalForModification = false
    },
    severityColor,
    toHtml(details) {
      return details
        .replaceAll('\n', '<br />')
        .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
    },
    openModalForModification(item) {
      console.log(item)
      this.item = item
      this.ModalForModification = true
    },
    openModalStatus(vulnerability) {
      this.vulnerability = vulnerability
      this.vulnerabilities = this.details
      this.ModalStatus = true
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
