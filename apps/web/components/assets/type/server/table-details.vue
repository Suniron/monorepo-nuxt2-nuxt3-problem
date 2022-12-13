<script>
import updateStatus from '~/components/vulnerabilities/update-status.vue'
import UpdateVulnerabilityForm from '~/components/assets/details/update-vulnerability-form.vue'
import DeleteVulnerabilityForm from '~/components/assets/details/delete-vulnerability-form.vue'
import { severityColor } from '~/utils/color.utils'
export default {
  components: {
    UpdateVulnerabilityForm,
    DeleteVulnerabilityForm,
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
        { text: 'Ip', value: 'ip' },
        { text: 'Port', value: 'port' },
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
      ModalForDelete: false,
      ModalStatus: false,
      item: {},
      vulnerabilities: null,
      vulnerability: null
    }
  },
  created() {
    this.$root.$on('ModalForModification', this.changeModalForModification)
    this.$root.$on('ModalForDelete', this.changeModalForDelete)
  },
  methods: {
    changeModalForDelete() {
      this.ModalForDelete = false
    },
    changeModalForModification() {
      this.ModalForModification = false
    },

    openModalForDelete(item) {
      this.item = item
      this.ModalForDelete = true
    },
    openModalForModification(item) {
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
      if (details) {
        return details
          .replaceAll('\n', '<br />')
          .replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;')
      }
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
      calculate-widths
    >
      <template #[`item.severity`]="{ item: itemSev }">
        <v-chip :color="severityColor(itemSev.severity)" dark>
          {{ itemSev.severity }}
        </v-chip>
      </template>
      <template #[`item.custom_description`]="{ item: itemDesc }">
        <p class="details-cell" v-html="itemDesc.custom_description" />
      </template>
      <template #[`item.custom_remediation`]="{ item: itemRem }">
        <p class="details-cell" v-html="itemRem.custom_remediation" />
      </template>
      <template #[`item.details`]="{ item: itemDets }">
        <p class="details-cell" v-html="itemDets.details" />
      </template>
      <template #[`item.port`]="{ item: itemPort }">
        <span v-if="itemPort.port !== undefined">{{ itemPort.port }}/{{ itemPort.protocol }}</span>
        <span v-else>N/A</span>
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
        <v-icon
          style="cursor:pointer"
          small
          right
          @click="openModalForDelete(itemEdit)"
        >
          mdi-delete
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
    <v-dialog v-model="ModalForDelete" width="500">
      <template #default>
        <DeleteVulnerabilityForm
          style="background-color:white"
          :item="item"
          :asset-id="asset.id"
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

<style scoped lang="scss">
.details-cell {
  overflow-y: auto;
  min-width: 180px;
  max-height: 400px;
  max-width: 600px;
}
</style>
