<script>
import { VCombobox, VSelect } from 'vuetify/lib'
import AssetsAdvancedSearchModal from './assets-advanced-search-modal.vue'
import { searchScanAssets } from '~/services/scans'
import { searchAssetsService } from '~/services/assets'

export default {
  components: {
    AssetsAdvancedSearchModal,
    VCombobox,
    VSelect,
  },
  data() {
    return {
      formData: {
        assets: []
      },
      assets: [],
      userAssets: [],
      advancedSearchModalOpen: false,
      rules: {
        notEmpty: [
          (v) =>
            this.formData.assets.length !== 0
              ? true
              : 'You must select at least one asset'
        ]
      },
      querySublist: '',
      regexURL: /(\w+(\.|-))+([a-zA-Z])+/,
      regexIP: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
    }
  },
  props: {
    assetType: {
      type: String,
      required: true
    },
    allowUserInput: {
      type: Boolean,
      default: false
    },
    allowAdvancedSearch: {
      type: Boolean,
      default: true
    },
    scanType: {
      type: Array,
      required: true
    }
  },
  computed: {
    /**
     * Return true if all assets are selected
     * @returns {Boolean}
     */
    areAllAssetsSelected() {
      return this.formData.assets.length === this.filteredList.length
    },
    /**
     * Return true if some assets are selected
     * @returns {Boolean}
     */
    areSomeAssetsSelected() {
      return this.formData.assets.length > 0 && !this.areAllAssetsSelected
    },

    /**
     * @returns {Array}
     */
    filteredList() {
      return this.assets.filter(asset =>
        (asset.name ?? asset).includes(this.querySublist ?? ''),
      )
    },

    /**
     * @returns {String}
     */
    icon() {
      if (this.areAllAssetsSelected)
        return 'mdi-close-box'
      if (this.areSomeAssetsSelected)
        return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  created() {
    this.fetchAssets()
  },
  methods: {

    addAssetsFromAdvancedSearch(selectedAssets) {
      this.formData.assets.push(
        ...selectedAssets.filter(
          asset =>
            !this.formData.assets.find(
              selectedAsset => selectedAsset.id === asset.id,
            ),
        ),
      )
      this.validateAssets()
      this.advancedSearchModalOpen = false
    },

    /**
     * Extract valid network addresses from string array
     * @param {{id: number, name: string}[] | string[]} valuesToCheck string array to check
     * @returns {string[]} valid network addresses
     */
    extractValidNetworkAdresses(valuesToCheck) {
      /**
       * @type {{name: string, id?: string}[]}
       */
      let networkAddresses = []

      // ... Add regex validation here:

      // Get all processed items
      networkAddresses = valuesToCheck.filter(value => value.name)

      /**
       * @type {string[]}
       */
      const itemsToAdd = valuesToCheck
        .filter(value => !value.name)
        .flatMap(items => items.split(/\n| |;|,/))

      itemsToAdd.forEach((item) => {
        let isValid = false
        if (
          this.scanType.includes('nmap')
          || this.scanType.includes('nessus')
          || this.scanType.includes('nessus_hardening')
        ) {
          if (item.match(this.regexIP) !== null) {
            isValid = true
          }
          else if (item.match(this.regexURL) !== null) {
            const domain = item.match(this.regexURL)
            item = domain[0]
            isValid = true
          }
        }
        if (isValid) {
          const existingAsset = this.assets.find(asset => asset.name === item)
          if (existingAsset)
            networkAddresses.push(existingAsset)
          else
            networkAddresses.push({ address: item, name: item })
        }
      })

      // ... add filters here:
      networkAddresses = networkAddresses.filter(na => na.name !== '')

      return networkAddresses
    },

    async fetchAssets() {
      if (this.assetType === 'server') {
        const fetchedAssets = await searchScanAssets(this.$axios)
        this.assets = fetchedAssets.map((asset) => {
          return {
            ...asset,
            name: asset.address,
          }
        })
        this.assets.forEach((element) => {
          if (!this.regexURL.test(element.name))
            return

          element.name = element.name.match(this.regexURL)[0]
        })
      }
      if (this.assetType === 'user') {
        const users = await searchAssetsService(this.$axios, {
          types: ['USER'],
        })
        this.assets = users.assets.map((asset) => {
          return {
            id: asset.id,
            mail: asset.mail,
            name: asset.name.concat(' - ', asset.mail),
            realName: asset.name,
          }
        })
        // this.assets = this.userAssets.map(({ id, name, mail }) => {
        //   return { id, name: name.concat(' - ', mail) }
        // })
      }
    },
    toggle() {
      if (this.areAllAssetsSelected)
        this.formData.assets = []
      else this.formData.assets = this.filteredList
      this.validateAssets()
    },
    validateAssets() {
      if (this.assetType === 'server') {
        this.formData.assets = this.extractValidNetworkAdresses(
          this.formData.assets,
        )
        this.$emit(
          'validateAssets',
          this.formData.assets.map((asset) => {
            return { address: asset.address, id: asset.id }
          }),
        )
      }
      if (this.assetType === 'user') {
        this.$emit(
          'validateUserAssets',
          this.formData.assets.map((asset) => {
            return { id: asset.id, mail: asset.mail, name: asset.realName }
          }),
        )
      }
    },
  },
}
</script>

<template>
  <div class="d-flex align-baseline" style="gap: 20px;">
    <component
      :is="allowUserInput ? 'v-combobox' : 'v-select'"
      v-model="formData.assets"
      v-model:search-input="querySublist"
      :items="assets"
      item-text="name"
      item-value="id"
      label="List of assets"
      :rules="rules.notEmpty"
      return-object
      solo
      multiple
      chips
      deletable-chips
      @change="validateAssets"
      @blur="querySublist = ''"
    >
      <template #prepend-item>
        <v-list-item ripple @mousedown.prevent @click="toggle">
          <v-list-item-action>
            <v-icon :color="assets.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title> Select All </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2" />
      </template>
    </component>
    <div v-if="allowAdvancedSearch" class="pb-5">
      <v-btn color="primary" @click="advancedSearchModalOpen = true">
        Advanced search
      </v-btn>
    </div>
    <v-dialog v-model="advancedSearchModalOpen" width="1200" persistent>
      <AssetsAdvancedSearchModal
        :available-assets="assets"
        @close="advancedSearchModalOpen = false"
        @select="addAssetsFromAdvancedSearch"
      />
    </v-dialog>
  </div>
</template>
