<template>
  <v-card class="d-flex flex-column">
    <v-card-title>Assets inventory</v-card-title>
    <v-card-text>
      <div class="d-flex justify-space-between mx-5">
        <v-switch v-model="groupByType" label="Group by type" hide-details />
        <v-switch
          v-model="showOnlySelected"
          label="Show only selected"
          hide-details
        />
      </div>
      <div style="border:1px solid black" class="ma-3">
        <v-text-field
          v-model="searchAsset"
          dense
          class="py-0"
          filled
          clearable
          label="Search an asset"
          hide-details
        ></v-text-field>
        <div class="d-flex flex-column justify-stretch">
          <LoadingSpinner v-if="isLoading" class="align-self-center ma-10" />
          <v-data-table
            v-else
            :headers="assetsHeaders"
            v-model="selected"
            :group-by="groupByType ? 'type' : null"
            :items="newUsableAvailableAssets"
            :search="searchAsset"
            :items-per-page="15"
            show-select
            dense
            @click:row="(_, { select }) => select()"
            @item-selected="itemSelected"
            @toggle-select-all="allSelected"
          >
            <template
              #[`group.header`]="{ group, groupBy, headers, toggle, isOpen }"
            >
              <td :colspan="headers.length">
                <v-btn @click="toggle" small icon :ref="group">
                  <v-icon v-if="isOpen" title="Collapse group"
                    >mdi-minus</v-icon
                  >
                  <v-icon v-else title="Expand group">mdi-plus</v-icon>
                </v-btn>

                <span class="mx-5 font-weight-bold"
                  >{{
                    assetsHeaders.find((header) => header.value === groupBy[0])
                      .text
                  }}: {{ group }}</span
                >
              </td>
            </template></v-data-table
          >
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-end mb-3">
      <v-btn @click="close" class="mx-3">Cancel</v-btn>
      <v-btn @click="verifyAddBtn" color="primary">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { searchAssetsService, searchAssetsBelonging } from '~/services/assets'
import { ASSET_TYPES } from '~/utils/asset.utils'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import {
  createBulkRelationService,
  deleteRelationByAssetsIdsService
} from '~/services/relations'

export default {
  components: { LoadingSpinner },
  props: {
    asset: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      required: false
    },
    allowedTypes: {
      type: Array,
      required: true
    },
    relationWanted: {
      type: String,
      required: true
    },
    relationType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      searchAsset: '',
      assetsBelongings: [],
      availableAssets: [],
      ASSET_TYPES,
      groupByType: false,
      showOnlySelected: false,
      assetsHeaders: [
        {
          text: 'Type',
          align: 'start',
          value: 'type'
        },
        {
          text: 'Name',
          value: 'name'
        }
      ],
      elementsToLink: [],
      elementsToUnlink: []
    }
  },
  computed: {
    /**
     * @returns {Array}
     */
    newUsableAvailableAssets() {
      return this.availableAssets
        .filter(
          (ass) =>
            ass.id !== this.asset.id &&
            !(this.showOnlySelected && !ass.isSelected)
        )
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    },
    /**
     * @returns {Array}
     */
    selected() {
      return this.newUsableAvailableAssets.filter((a) => a.isSelected)
    }
  },
  watch: {
    isOpen(value) {
      if (value) {
        this.fetchAsset()
      }
    }
  },
  created() {
    this.fetchAsset()
  },
  methods: {
    linkElement(elementId) {
      if (this.elementsToUnlink.includes(elementId)) {
        this.elementsToUnlink.splice(
          this.elementsToUnlink.indexOf(elementId),
          1
        )
      } else {
        this.elementsToLink.push(elementId)
      }
    },
    unlinkElement(elementId) {
      if (this.elementsToLink.includes(elementId)) {
        this.elementsToLink.splice(this.elementsToLink.indexOf(elementId), 1)
      } else {
        this.elementsToUnlink.push(elementId)
      }
    },
    async verifyAddBtn() {
      await Promise.all(
        this.elementsToUnlink.map((newRelativeId) =>
          deleteRelationByAssetsIdsService(this.$axios, {
            fromAssetId:
              this.relationWanted === 'children'
                ? newRelativeId
                : this.asset.id,
            relationType: this.relationType,
            toAssetId:
              this.relationWanted === 'children' ? this.asset.id : newRelativeId
          })
        )
      )

      if (this.elementsToLink.length > 0) {
        await createBulkRelationService(
          this.$axios,
          this.elementsToLink.map((newRelativeId) => ({
            fromAssetId:
              this.relationWanted === 'children'
                ? newRelativeId
                : this.asset.id,
            relationType: this.relationType,
            toAssetId:
              this.relationWanted === 'children' ? this.asset.id : newRelativeId
          }))
        )
      }

      this.elementsToLink.splice(0, this.elementsToLink.length)
      this.elementsToUnlink.splice(0, this.elementsToUnlink.length)

      this.$emit('saved')
    },
    close() {
      this.$emit('closed')
    },
    allSelected({ items, value }) {
      items.forEach((item) => (item.isSelected = value))
    },
    itemSelected({ item, value }) {
      item.isSelected = value
      if (value) {
        this.linkElement(item.id)
      } else {
        this.unlinkElement(item.id)
      }
    },
    async fetchAsset() {
      this.isLoading = true
      this.availableAssets = []
      const option = {}
      if (this.relationWanted === 'children') option.parentsIds = this.asset.id
      if (this.relationWanted === 'parents') option.childrenIds = this.asset.id
      const { assets } = await searchAssetsService(this.$axios, {
        types: this.allowedTypes
      })

      const { data: assetsBelongings } = await searchAssetsBelonging(
        this.$axios,
        option
      )
      this.assetsBelongings = assetsBelongings.assets.filter(
        (e) => e.id !== this.asset.id
      )
      this.availableAssets = assets.map((e) => {
        return {
          ...e,
          isSelected: this.assetsBelongings.map((a) => a.id).includes(e.id)
        }
      })
      this.isLoading = false
    }
  }
}
</script>

<style></style>
