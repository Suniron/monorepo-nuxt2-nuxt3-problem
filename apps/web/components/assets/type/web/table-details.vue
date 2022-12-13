<script>
import updateStatus from '~/components/vulnerabilities/update-status.vue'
import UpdateVulnerabilityForm from '~/components/assets/details/update-vulnerability-form.vue'
import { severityColor } from '~/utils/color.utils'

export default {
  components: {
    UpdateVulnerabilityForm,
    updateStatus
  },
  name: 'ServerTableDetails',
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
        { text: 'Edit', value: 'edit' },
      ],
      ModalForModification: false,
      isSaveModalOpen: false,
      ModalStatus: false,
      item: {},
      vulnerabilities: null,
      vulnerability: null
    }
  },
  created() {
    this.$root.$on('ModalForModification', this.changeModalForModification)
  },
  methods: {
    changeModalForModification() {
      this.ModalForModification = false
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
    },
    severityColor,
    toHtml(details) {
      return details
        .replaceAll('\n', '<br />')
        .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
    },
  },
}
</script>

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
          class="details-cell"
          v-html="toHtml(itemDets.details)"
        />
        <p v-else />
      </template>
      <template #[`item.status`]="{ item: itemStat }">
        <v-chip small @click.stop="openModalStatus(itemStat)">
          {{ itemStat.status || 'Open' }}
          <v-icon small right>
            mdi-file-document-edit-outline
          </v-icon>
        </v-chip>
      </template>
      <template #[`item.edit`]="{ item: itemEdit }">
        <v-icon
          style="cursor:pointer"
          small
          right
          @click="openModalForModification(itemEdit)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="ModalForModification" width="1500">
      <template #default>
        <UpdateVulnerabilityForm
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

<style lang="scss">
.details-cell {
  overflow-y: auto;
  max-height: 400px;
  max-width: 600px;
}
</style>
