<template>
  <div>
    <div class="d-flex align-center">
      <v-combobox
        :items="getGroupedRemediations"
        :value="selectedGroupedRemediation"
        item-text="remediationSummary"
        item-value="clusterId"
        @input="selectGroupedRemediation"
        dense
        filled
        solo
        deletable-chips
        label="Select a remediation"
        placeholder="Select a remediation"
        return-object
        hide-details
        :menu-props="{
          bottom: true,
          offsetY: true,
          closeOnClick: true
        }"
      >
        <template #item="{ item: remediation }">
          ({{
            remediation.count_asset_vuln_unmanaged > 1
              ? `${remediation.count_asset_vuln_unmanaged} asset vulnerabilities`
              : '1 asset vulnerability'
          }}) {{ remediation.remediationSummary }}
        </template>
        <template v-if="selectedGroupedRemediation" #append>
          +{{ selectedGroupedRemediation.count_asset_vuln_unmanaged }}
        </template>
      </v-combobox>
      <v-btn
        color="primary"
        class="mx-5 align-center"
        :disabled="!selectedGroupedRemediation"
        @click="addRemediationCluster"
      >
        Add to project
        <v-icon class="ml-2">mdi-plus-box-multiple</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { parseRemediationHtml } from '~/utils/remediationProject.utils'
/**
 * @typedef {{
 *  clusterId: number,
 *  remediation: string,
 *  count_vuln: number,
 *  count_asset: number,
 *  count_asset_vuln: number,
 *  count_asset_vuln_unmanaged: number,
 *  remediationSummary: string
 * }} GroupedRemediation
 */

export default {
  props: {
    /**
     * @type {import('vue').PropType<GroupedRemediation[]>}
     */
    groupedRemediations: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      /**
       * @type {GroupedRemediation}
       */
      selectedGroupedRemediation: null
    }
  },
  computed: {
    /**
     * @returns {GroupedRemediation[]}
     */
    getGroupedRemediations() {
      return this.groupedRemediations
        .filter((remediation) => remediation.remediation)
        .map((remediation) => {
          return {
            ...remediation,
            remediationSummary: parseRemediationHtml(
              remediation.remediation,
              100
            )
          }
        })
    }
  },
  methods: {
    selectGroupedRemediation(cluster) {
      this.selectedGroupedRemediation = cluster
    },
    addRemediationCluster() {
      this.$emit('add-remediation-cluster', this.selectedGroupedRemediation)
      this.selectGroupedRemediation(null)
    }
  }
}
</script>
