<script>
import _debounce from 'lodash/debounce'

import SaveAssetModal from '~/components/assets/save-asset-modal'
import AssetsToolbarImport from '~/components/assets/toolbar/import/index.vue'

// Controls
import ScanImport from '~/components/controls/scan-import.vue'
import GroupsMultiselect from '~/components/controls/groups-multiselect'
import TagsMultiselect from '~/components/controls/tags-multiselect'

import { processCSV } from '~/services/fileUpload'
import { importCsvService, searchAssetsService } from '~/services/assets'
import { ASSET_TYPES } from '~/utils/asset.utils'

const DEBOUNCE_WAIT = 300 // ms

export default {
  components: {
    GroupsMultiselect,
    TagsMultiselect,
    SaveAssetModal,
    ScanImport,
    AssetsToolbarImport
  },
  name: 'AssetsToolbar',
  props: {
    search: {
      type: String,
      default: ''
    },
    assets: {
      type: Array,
      default: () => []
    },
    /**
     * Array of tag IDs. Used when setting selected tags from route query
     */
    tags: {
      type: Array,
      default: () => []
    },
    severities: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    types: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const severities = ['critical', 'high', 'medium', 'low']

    return {
      allAssets: [],
      filters: {
        search: this.search,
        severities: [...this.severities],
        tags: [...this.tags],
        groups: [...this.groups],
        types: [...this.types],
      },
      isSaveModalOpen: false,
      severityOptions: severities.map((severity) => ({
        text: severity,
        value: severity
      })),

      tab: 0,
      validations: {
        required: [(value) => !!value || 'Required.']
      },
      isFormValid: false,
      isLoading: false,
      isProcessed: false,
      file: null,
      show: false,
      dialog: false,
      isUploaded: false,
      isCsvValid: false,
      failed: [],
      pass: 0,
      failedText: '',
      passText: '',
      csv: {},
      headers: [
        { text: 'Keys', value: 'key' },
        { text: 'Proposed CSV column', value: 'csv' },
        { text: 'Default Value', value: 'default' },
      ],
      csvHeaders: [],
      values: [],
      assetType: '',
      csvData: [],
      scan: null,
    }
  },
  computed: {

    /**
     * @returns {string[]}
     */
    queryTypes() {
      return this.$route.query.types
        ? this.$route.query.types.split(',')
        : ASSET_TYPES.map(type => type.type)
    },

    typesLen() {
      return this.queryTypes.length
    },

    /**
     * Aggregating all unique groups
     */
    usedGroups() {
      return this.allAssets.reduce((acc, { groups }) => {
        groups.forEach((group) => {
          if (!acc.find(usedGroup => usedGroup.id === group.id))
            acc.push(group)
        })
        return acc
      }, [])
    },
    /**
     * @returns {Array}
     */
    usedTags() {
      return this.allAssets.reduce((acc, { tags }) => {
        tags.forEach((tag) => {
          if (!acc.find(usedTag => usedTag.id === tag.id))
            acc.push(tag)
        })
        return acc
      }, [])
    },
  },
  created() {
    this.updateAssetType()
    this.debouncedUpdateFilter = _debounce(this.updateFilter, DEBOUNCE_WAIT)
    this.debouncedUpdateAllAssets = _debounce(
      this.updateAllAssets,
      DEBOUNCE_WAIT
    )
  },
  watch: {
    severities(newSeverities) {
      this.filters.severities = [...newSeverities]
    },
    groups(newGroups) {
      this.filters.groups = [...newGroups]
    },
    tags(newTags) {
      this.filters.tags = [...newTags]
    },
    $route(to, from) {
      this.updateAssetType()
      if (to.query.types !== from.query.types) {
        this.filters = {
          search: '',
          tags: [],
          severities: [],
          groups: [],
          types: []
        }
      }
    },
    types() {
      this.debouncedUpdateAllAssets()
    },
    assets: {
      handler() {
        this.debouncedUpdateAllAssets()
      },
      deep: true
    },
    search() {
      if (this.filter) {
        this.filter.search = this.search
      }
    },
    'filters.search'(newSearch) {
      this.debouncedUpdateFilter({ name: 'search', value: newSearch })
    }
  },
  mounted() {
    this.debouncedUpdateAllAssets()
  },
  methods: {
    async updateAllAssets() {
      const { assets } = await searchAssetsService(this.$axios, {
        types: this.types
      })
      this.allAssets = assets
    },
    updateAssetType() {
      // we're just looking if there is multiples types inside our types params.
      // if there is, it will always be splittable by the ',' so, we will sort them
      // and verify the assetType to show our vulnerabilities
      if (this.queryTypes.length > 1) {
        for (const elem of this.queryTypes.slice().sort()) {
          this.assetType += elem
        }
      } else {
        this.assetType = this.$route.query.types
      }
    },
    filterGroups(groups) {
      this.$emit('filter', {
        name: 'groupIds',
        value: groups.map((g) => g.id)
      })
    },
    updateFilter(payload) {
      this.$emit('filter', payload)
    },
    filterTags(tags) {
      this.$emit('filter', {
        name: 'tagIds',
        value: tags.map(g => g.id),
      })
    },
    async importAssets() {
      const { pass, failed } = await importCsvService(this.$axios, {
        headers: this.values,
        data: this.csvData
      })
      console.log(pass, failed)
      this.isCsvValid = false
      this.pass = pass
      this.failed = failed
      this.passText = pass + ' record(s) has been processed'
      this.failedText = failed.length + ' record(s) could not be processed'
      this.isProcessed = true
    },
    removeSeverity(item) {
      this.filters.severities.splice(
        this.filters.severities.indexOf(item.value),
        1
      )
      this.updateFilter({
        name: 'severities',
        value: [...this.filters.severities]
      })
    },
    async uploadFiles() {
      const fileData = new FormData()
      fileData.append('files', this.file, this.file.name)
      const data = await processCSV(this.$axios, fileData)
      this.values = data.headers
      this.csvHeaders = data.csvHeaders
      this.csvData = data.csvData
      this.isCsvValid = true
      this.isUploaded = true
    },
  },
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row style="min-width: 400px">
          <v-text-field
            v-model="filters.search"
            v-test="'assets-list-search-field'"
            class="search mr-4"
            label="Search asset"
          />
          <TagsMultiselect
            :selected-values="filters.tags"
            :subset="usedTags"
            label="Tags"
            placeholder="Select Tags"
            @input="(newTags) => filterTags(newTags)"
          />
          <v-select
            v-if="
              assetType !== 'POLICY'
                && assetType !== 'PROCEDURE'
                && assetType !== 'POLICYPROCEDURE'
            "
            v-model="filters.severities"
            :items="severityOptions"
            class="severity-select mr-4"
            label="Severities"
            chips
            multiple
            placeholder="Select Severities"
            :menu-props="{
              bottom: true,
              offsetY: true,
              closeOnClick: true,
            }"
            @input="
              (severities) =>
                $emit('filter', { name: 'severities', value: severities })
            "
          >
            <template #selection="{ item }">
              <v-chip
                :class="[`severity--${item.value}`]"
                class="severity"
                close
                @click:close="removeSeverity(item)"
              >
                <span>{{ item.text }}</span>
              </v-chip>
            </template>
          </v-select>
          <GroupsMultiselect
            :selected-values="filters.groups"
            label="Groups"
            :subset="usedGroups"
            @input="(newGroups) => filterGroups(newGroups)"
          />
        </v-row>
      </v-col>
      <v-col>
        <v-row justify-md="end">
          <!-- BULK EDIT SECTION -->
          <v-btn
            v-if="typesLen === 1"
            class="ma-1"
            color="primary"
            @click="$emit('bulk')"
          >
            Bulk Edit
          </v-btn>

          <!-- IMPORT SECTION -->
          <AssetsToolbarImport v-if="assetType !== 'POLICY' && assetType !== 'PROCEDURE'" />

          <!-- OLD: -->
          <div v-if="false">
            <v-tabs v-model="tab">
              <v-tab>Assets</v-tab>
              <v-tab>Scan Results</v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card>
                  <v-card-title> Import Assets </v-card-title>
                  <v-card-text>
                    <v-form ref="form" v-model="isFormValid">
                      <v-container>
                        <v-row>
                          <v-col cols="12" lg="8">
                            <!-- <v-file-input
                      v-model="file"
                      class="pt-0"
                      label="Upload your document"
                      :rules="validations.required"
                      accept="text/csv"
                      @change="show = true"
                      @click:clear="isUploaded = false"
                    /> -->
                          </v-col>
                          <v-col cols="12" lg="2">
                            <!-- <v-tooltip v-model="show" top>
                      <template #activator="{ on }">
                        <div v-on="on">
                          <v-btn
                            icon
                            x-large
                            color="primary"
                            :disabled="isUploaded"
                            @click="uploadFiles"
                          >
                            <v-icon>mdi-file-upload-outline</v-icon>
                          </v-btn>
                        </div>
                      </template>
                      <span>Click to upload your document first</span>
                    </v-tooltip> -->
                          </v-col>
                          <v-col cols="12" lg="2">
                            <v-btn color="primary" x-large>
                              Sample CSV
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <!-- <v-data-table
                      v-if="isCsvValid"
                      :headers="headers"
                      :items="values"
                    >
                      <template #[`item.default`]="{ item }">
                        <v-text-field
                          v-model="item.default"
                        />
                      </template>
                      <template #[`item.csv`]="{ item }">
                        <v-select
                          v-model="item.csv"
                          :items="csvHeaders"
                          item-text="csv"
                          item-value="indexes"
                        />
                      </template>
                    </v-data-table> -->
                          </v-col>
                        </v-row>
                        <!-- <template v-if="isProcessed">
                  <v-row>
                    <v-col cols="12">
                      <p>{{ passText }} / {{ failedText }}</p>
                    </v-col>
                  </v-row>
                </template> -->
                        <v-row>
                          <v-col>
                            <!-- <v-btn
                      class="mr-2"
                      :disabled="isLoading"
                      @click="dialog = isProcessed = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      v-if="isProcessed === false"
                      color="primary"
                      :disabled="!isFormValid"
                      :loading="isLoading"
                      @click="importAssets"
                    >
                      Save
                    </v-btn>
                    <v-btn
                      v-else
                      color="primary"
                      @click="dialog = isProcessed = false"
                    >
                      OK
                    </v-btn> -->
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <!-- <ScanImport @close="dialog = isProcessed = false" /> -->
              </v-tab-item>
            </v-tabs-items>
          </div>

          <!-- CREATE ASSET SECTION -->
          <v-dialog v-model="isSaveModalOpen" width="500">
            <template #activator="{ on, attrs }">
              <v-btn
                v-test="'assets-toolbar-create-btn'"
                class="ma-1"
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                + Create asset
              </v-btn>
            </template>
            <template #default>
              <SaveAssetModal
                @saved="$emit('saved')"
                @close="isSaveModalOpen = false"
              />
            </template>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
