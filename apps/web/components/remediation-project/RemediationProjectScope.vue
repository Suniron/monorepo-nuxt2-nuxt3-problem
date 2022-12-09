<script>
import { parseRemediationHtml } from '~/utils/remediationProject.utils'
export default {
  model: {
    event: 'updateSelectedScopeElements',
    prop: 'selectedScopeElements'
  },
  data() {
    return {
      selectedScopeElements: [],
      page: 1,
      itemsPerPage: 15,
      scopeHeaders: [
        { text: 'Source', value: 'source.name' },
        { text: 'Asset', value: 'asset.name' },
        { text: 'Vulnerability', value: 'vulnerability.name' }
      ]
    }
  },
  methods: {
    /**
     * @param {string} html
     * @returns {string}
     */
    fixHtml(html) {
      return html.replace(/\\n/g, '<br>')
    },
    /**
     * @param {string} html
     * @returns {string}
     */
    parseHtmlShort(remediationHtml) {
      return parseRemediationHtml(remediationHtml, 40)
    },
  },
  watch: {
    selectedScopeElements() {
      this.$emit('updateSelectedScopeElements', this.selectedScopeElements)
    },
  },
  props: {

    filter: {
      default: () => '',
      type: String,
    },
    /**
     * @type {import('vue').PropOptions<import('~/types/remediationProject').ScopeType>}
     */
    scope: {
      required: true,
      type: Array,
    },
    selectedGroup: {
      default: () => '',
      type: String,
    },
  },
}
</script>

<template>
  <div class="p-relative">
    <v-data-table
      v-model="selectedScopeElements"
      v-model:page="page"
      class="mx-5 remediation-project-scope h-100"
      :headers="scopeHeaders"
      :items="scope"
      item-key="vulnerability.vastId"
      :group-by="selectedGroup"
      show-select
      :search="filter"
      :items-per-page="itemsPerPage"
      dense
    >
      <template
        #[`group.header`]="{ group, groupBy, headers, toggle, isOpen, remove }"
      >
        <td :colspan="headers.length">
          <v-btn :ref="group" small icon @click="toggle">
            <v-icon v-if="isOpen" title="Collapse group">
              mdi-minus
            </v-icon>
            <v-icon v-else title="Expand group">
              mdi-plus
            </v-icon>
          </v-btn>

          <span class="mx-5 font-weight-bold">{{
            scopeHeaders.find((header) => header.value === groupBy[0]).text
          }}: {{ group }}</span>
          <v-btn
            :ref="group"
            small
            icon
            title="Remove grouping"
            @click="remove"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </td>
      </template>
      <template #[`item.source.name`]="{ item }">
        <v-tooltip top open-delay="750" open-on-hover>
          <template #activator="{ on, attrs }">
            <td v-bind="attrs" v-on="on">
              <span v-if="item.source.type === 'CLUSTER'">Remediation: </span>{{ parseHtmlShort(item.source.name) }}
            </td>
          </template>
          <span v-html="fixHtml(item.source.name)" />
        </v-tooltip>
      </template>
      <template #[`item.asset.name`]="{ item }">
        <v-tooltip top open-delay="750" open-on-hover>
          <template #activator="{ on, attrs }">
            <td v-bind="attrs" v-on="on">
              {{ parseHtmlShort(item.asset.name) }}
            </td>
          </template>
          <span v-html="fixHtml(item.asset.name)" />
        </v-tooltip>
      </template>
      <template #[`item.vulnerability.name`]="{ item }">
        <v-tooltip top open-delay="750" open-on-hover>
          <template #activator="{ on, attrs }">
            <td v-bind="attrs" v-on="on">
              {{ parseHtmlShort(item.vulnerability.name) }}
            </td>
          </template>
          <span v-html="fixHtml(item.vulnerability.name)" />
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<style>
.remediation-project-scope > .v-data-table__wrapper {
  min-height: calc(
    100% - 59px
  ); /* 59px is the height of the footer in vuetify */
}

.remediation-project-scope-clear {
  position: absolute !important;
  top: 0px;
  right: 0px;
}
</style>
