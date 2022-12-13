<script>
import AssetsToolbar from '~/components/assets/assets-toolbar.vue'
import AssetCard from '~/components/assets/asset-card.vue'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'
import VulnerabilityForm from '@/components/assets/details/vulnerability-form.vue'

// Mixins
import { queryManager } from '~/components/mixins'

// Services
import {
  deleteAssetsBulkService,
  searchAssetsService,
  updateAssetsBulkService,
} from '~/services/assets'
import { ASSET_TYPES } from '~/utils/asset.utils'

export default {
  components: {
    AssetsToolbar,
    AssetCard,
    AssetInfo,
    VulnerabilityForm
  },
  name: 'AssetsPage',
  mixins: [queryManager],
  middleware: ['auth'],
  created() {
    this.$root.$on('fetchTagsAgain', this.fetchAssets)
    this.setFiltersFromQuery(this.$route.query)
    this.setTitle()
  },
  data: () => ({
    assets: [],
    filters: {
      search: '',
      groupIds: [],
      tagIds: [],
      severities: [],
      page: 1,
      types: [],
      pageSize: 20,
    },
    isBulkEdit: false,
    vulnForm: false,
    isFormValid: false,
    totalPage: 0,
    form: {},
    modalDeleteAssets: false,
  }),
  methods: {
    changed(formData) {
      formData.selected.length > 0 && formData.isValid
        ? (this.isFormValid = true)
        : (this.isFormValid = false)
      this.form = formData
    },
    closeModalAndFetchAssets() {
      this.vulnForm = false
      this.fetchAssets()
    },
    closeModalDeleteAssets() {
      this.modalDeleteAssets = false
    },
    async deleteAssets() {
      const body = {}
      body.assets = this.form.selected?.reduce((res, elt) => {
        res.push(elt.id)
        return res
      }, [])
      await deleteAssetsBulkService(this.$axios, body)
      this.form.selected = []
      this.fetchAssets()
      this.closeModalDeleteAssets()
    },
    async fetchAssets() {
      this.loading = true
      try {
        const serviceParams = { page: 1, pageSize: 20 }
        if (this.filters.search)
          serviceParams.search = this.filters.search
        if (this.filters.tagIds?.length)
          serviceParams.tagIds = this.filters.tagIds
        if (this.filters.groupIds?.length)
          serviceParams.groupIds = this.filters.groupIds
        if (this.filters.severities?.length)
          serviceParams.severities = this.filters.severities
        if (this.filters.types?.length)
          serviceParams.types = this.filters.types
        if (this.filters.page)
          serviceParams.page = this.filters.page
        if (this.filters.pageSize)
          serviceParams.pageSize = this.filters.pageSize

        const { assets, total } = await searchAssetsService(
          this.$axios,
          serviceParams,
        )
        this.assets = assets
        this.totalPage = Math.ceil(total / this.filters.pageSize) || 0
      }
      catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    setFilter({ name, value }) {
      if (name === 'search') {
        this.filters.search = value
      }
      else if (name === 'tagIds' && Array.isArray(value)) {
        this.filters.tagIds = [...value]
      }
      else if (name === 'severities') {
        const SEVERITIES = {
          critical: 'critical',
          high: 'high',
          low: 'low',
          medium: 'medium',
        }

        if (
          Array.isArray(value)
          && (!value.length || value.every(sev => SEVERITIES[sev]))
        )
          this.filters.severities = [...value]
      }
      else if (name === 'groupIds' && Array.isArray(value)) {
        this.filters.groupIds = [...value]
      }
      else if (name === 'types' && Array.isArray(value)) {
        this.filters.types = [...value]
      }
      this.filters.page = 1
      this.filters.pageSize = 20

      // Update the query in the url if not all asset types are selected
      if (value.length !== ASSET_TYPES.length)
        this.mx_updateQueryParam({ name, value })

      this.fetchAssets()
    },
    setFiltersFromQuery(query) {
      if (!query)
        return

      if (query.search)
        this.setFilter({ name: 'search', value: query.search })

      if (query.severities) {
        this.setFilter({
          name: 'severities',
          value: query.severities.split(','),
        })
      }

      this.setFilter({
        name: 'types',
        value: query.types
          ? query.types.split(',')
          : ASSET_TYPES.map(type => type.type),
      })
    },
    setTitle() {
      if (this.filters.types.length === 0 || this.filters.types.length > 1)
        this.$store.dispatch('changePageTitle', 'Assets')
      else if (this.filters.types.includes('SERVER'))
        this.$store.dispatch('changePageTitle', 'Servers')
      else if (this.filters.types.includes('USER'))
        this.$store.dispatch('changePageTitle', 'Users')
      else if (this.filters.types.includes('WEB'))
        this.$store.dispatch('changePageTitle', 'Web Sites')
      else if (this.filters.types.includes('BUILDING'))
        this.$store.dispatch('changePageTitle', 'Buildings')
      else if (this.filters.types.includes('POLICY'))
        this.$store.dispatch('changePageTitle', 'Policies')
      else if (this.filters.types.includes('PROCEDURE'))
        this.$store.dispatch('changePageTitle', 'Procedures')
      else this.$store.dispatch('changePageTitle', 'Assets')
    },
    async submit() {
      const body = {}
      body.name = this.form.name
      body.assets = this.form.selected?.reduce((res, elt) => {
        res.push(elt.id)
        return res
      }, [])
      body.tagIds = this.form.tags?.reduce((res, elt) => {
        res.push(elt.id)
        return res
      }, [])
      body.groupIds = this.form.groups?.reduce((res, elt) => {
        res.push(elt.id)
        return res
      }, [])

      const copy = Object.assign(this.form)
      delete copy.name
      delete copy.selected
      delete copy.tags
      delete copy.groups

      body.type = this.filters.types[0]
      body.assetData = copy
      await updateAssetsBulkService(this.$axios, body)
      this.fetchAssets()
    },
  },
  watch: {
    $route(to, from) {
      // If we want to close the bulkEdit everytime we change page, we just put our isBulkEdit to false everytime there is a change.
      this.isBulkEdit = false
      if (to.query.types !== from.query.types) {
        this.filters.tagIds = []
        this.filters.groupIds = []
        this.filters.severities = []
        this.$root.$emit('CHANGEPAGEFORCREATEASSET')
      }
      // just delete/ comment the lign if we want to keep the bulkEdit open.
      if (Object.entries(to.query).length === 0)
        this.setFilter({ name: 'types', value: [] })
      else this.setFiltersFromQuery(to.query)
      this.setTitle()
    },
  },
}
</script>

<template>
  <v-container class="assets">
    <v-data-iterator
      :items="assets"
      :items-per-page="100"
      item-key="id"
      hide-default-footer
    >
      <template v-if="loading && assets.length === 0" slot="no-data">
        <p>{{ $t('t.loading') }}</p>
      </template>
      <template v-if="assets.length === 0 && !loading" slot="no-data">
        <v-alert text type="info">
          {{ $t('t.noDataToShow') }}
        </v-alert>
      </template>
      <!-- Toolbar header -->
      <template #header>
        <AssetsToolbar
          :assets="assets"
          :search="filters.search"
          :tags="filters.tagIds"
          :severities="filters.severities"
          :groups="filters.groupIds"
          :types="filters.types"
          @filter="setFilter"
          @saved="fetchAssets"
          @bulk="
            isBulkEdit = !isBulkEdit
            isFormValid = false
          "
        />
      </template>

      <!-- Cards -->
      <template v-if="!isBulkEdit" #default="{ items }">
        <v-row>
          <v-col
            v-for="item of items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mt-2"
          >
            <AssetCard :asset="item" @saved="fetchAssets" @delete="fetchAssets" />
          </v-col>
        </v-row>
      </template>
      <template v-else #default="{ items }">
        <AssetInfo
          :asset="{ type: filters.types[0] }"
          section="bulkEdit"
          :details="items"
          @change="changed"
        />
      </template>
    </v-data-iterator>

    <v-container v-if="isBulkEdit">
      <div class="m-2 d-flex justify-space-between">
        <div>
          <v-dialog
            v-if="filters.types[0] === 'SERVER' && filters.types.length === 1"
            v-model="vulnForm"
            width="1600"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                style="margin: 0 1em"
                class="create-asset-btn"
                color="primary"
                v-bind="attrs"
                :disabled="!isFormValid"
                v-on="on"
              >
                {{ $t('action.addVulnerabilitiesToSelectedAssets') }}
              </v-btn>
            </template>
            <template #default style="background-color:white">
              <VulnerabilityForm
                style="background-color:white;padding:1.5em"
                :is-open="vulnForm"
                :selected-asset="form.selected"
                :asset="{ type: filters.types[0] }"
                @close="closeModalAndFetchAssets"
                @change="vulnForm = !vulnForm"
              />
            </template>
          </v-dialog>
        </div>
        <div>
          <v-dialog v-model="modalDeleteAssets" width="50%">
            <template #activator="{ on, attrs }">
              <v-btn
                class="ms-1 create-asset-btn"
                color="primary"
                v-bind="attrs"
                :disabled="!isFormValid"
                v-on="on"
              >
                {{ $t('action.deleteSelectedAssets') }}
              </v-btn>
            </template>
            <template #default>
              <div class="pa-6 white">
                <div class="d-flex flex-column">
                  <span class="text-center red--text font-weight-bold">
                    {{ $t('t.irreversibleAction') }}
                  </span>
                  <span> {{ $t('t.deleteMessage') }} </span>
                </div>
                <ul>
                  <li v-for="select in form.selected" :key="select.id">
                    {{ select.name }}
                  </li>
                </ul>
                <div class="text-center">
                  <v-btn class="text-center" @click="closeModalDeleteAssets">
                    {{ $t('action.cancel') }}
                  </v-btn>
                  <v-btn class="error" @click="deleteAssets">
                    {{ $t('action.deleteMyAssets') }}
                  </v-btn>
                </div>
              </div>
            </template>
          </v-dialog>

          <v-btn color="primary" :disabled="!isFormValid" @click="submit">
            {{
              $t('action.submit')
            }}
          </v-btn>
        </div>
      </div>
    </v-container>
    <div class="text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-container class="max-width">
              <v-pagination
                v-model="filters.page"
                class="my-4"
                :length="totalPage"
                @next="fetchAssets()"
                @previous="fetchAssets()"
                @input="fetchAssets()"
              />
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<style lang="scss"></style>
