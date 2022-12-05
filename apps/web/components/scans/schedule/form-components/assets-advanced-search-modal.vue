<template>
  <v-card>
    <v-card-title>Advanced Assets Search</v-card-title>
    <v-row class="ma-3">
      <v-col cols="4">
        <v-combobox
          class="ma-3"
          placeholder="Super assets"
          label="Super assets"
          :items="superAssetsItems"
          v-model="selectedSuperAssets"
          chips
          deletable-chips
          multiple
        >
          <template #item="{item}">
            <div class="d-flex flex-grow-1 justify-space-between">
              <span>{{ item.text }}</span>
              <span>{{ item.value.children.length }} assets</span>
            </div>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="4">
        <v-combobox
          class="ma-3"
          placeholder="Tags"
          label="Tags"
          :items="tagsItems"
          v-model="selectedTags"
          chips
          deletable-chips
          multiple
        >
          <template #item="{item}">
            <div class="d-flex flex-grow-1 justify-space-between">
              <span>{{ item.text }}</span>
              <span>{{ item.value.children.length }} assets</span>
            </div>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="4">
        <v-combobox
          class="ma-3"
          placeholder="Teams"
          label="Teams"
          :items="groupsItems"
          v-model="selectedGroups"
          chips
          deletable-chips
          multiple
        >
          <template #item="{item}">
            <div class="d-flex flex-grow-1 justify-space-between">
              <span>{{ item.text }}</span>
              <span>{{ item.value.children.length }} assets</span>
            </div>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <v-card-text>
      <h3>Selected assets</h3>
      <p v-if="selectedAssets.length === 0">No assets selected</p>
      <p v-else-if="selectedAssets.length === 1">1 asset selected</p>
      <p v-else>{{ selectedAssets.length }} assets selected</p>
      <v-chip-group column>
        <v-chip
          v-for="selectedAsset in selectedAssets"
          :key="selectedAsset.id"
          >{{ selectedAsset.name }}</v-chip
        >
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelSelection">Cancel</v-btn>
      <v-btn
        color="primary"
        :disabled="selectedAssets.length === 0"
        @click="selectAssets"
        >Select<span v-if="selectedAssets.length === 0"></span
        ><span v-else-if="selectedAssets.length === 1"> asset</span
        ><span v-else> {{ selectedAssets.length }} assets</span></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { searchAssetsService } from '~/services/assets'
import { SUPER_ASSET_TYPES } from '~/utils/asset.utils'
export default {
  props: {
    availableAssets: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      assetsData: [],
      selectedSuperAssets: [],
      selectedTags: [],
      selectedGroups: [],
      superAssets: {},
      tags: {},
      groups: {}
    }
  },
  computed: {
    /**
     * @returns {Array}
     */
    superAssetsItems() {
      return Object.values(this.superAssets)
    },
    /**
     * @returns {Array}
     */
    tagsItems() {
      return Object.values(this.tags)
    },
    /**
     * @returns {Array}
     */
    groupsItems() {
      return Object.values(this.groups)
    },
    /**
     * @returns {Array}
     */
    selectedAssetsIds() {
      return Array.from(
        new Set(
          this.selectedSuperAssets
            .flatMap((superAsset) => superAsset.value.children)
            .concat(this.selectedTags.flatMap((tag) => tag.value.children))
            .concat(
              this.selectedGroups.flatMap((group) => group.value.children)
            )
            .map((asset) => asset.id)
        )
      )
    },
    /**
     * @returns {Array}
     */
    selectedAssets() {
      return this.selectedAssetsIds.map((assetId) =>
        this.availableAssets.find((asset) => asset.id === assetId)
      )
    }
  },
  async mounted() {
    // Query and fill the assets data by splitting this.availableAssets in chunks of 400
    const assetChunks = this.availableAssets.reduce((acc, asset, index) => {
      const chunkIndex = Math.floor(index / 400)
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = []
      }
      acc[chunkIndex].push(asset)
      return acc
    }, [])
    for (const assetChunk of assetChunks) {
      const { assets } = await searchAssetsService(this.$axios, {
        ids: assetChunk.map((asset) => asset.id)
      })
      this.assetsData.push(...assets)
    }
    const allSuperAssets = (
      await searchAssetsService(this.$axios, {
        types: SUPER_ASSET_TYPES
      })
    ).assets

    this.availableAssets.forEach((availableAsset) => {
      const allParents = getAllParents(availableAsset.id, allSuperAssets)
      allParents.forEach((parent) => {
        if (this.superAssets[parent.id]) {
          this.superAssets[parent.id].value.children.push(availableAsset)
        } else {
          this.$set(this.superAssets, parent.id, {
            text: parent.name,
            value: {
              id: parent.id,
              name: parent.name,
              type: parent.type,
              children: [availableAsset]
            }
          })
        }
      })
    })

    this.assetsData.forEach((assetData) => {
      assetData.tags.forEach((tag) => {
        if (this.tags[tag.id]) {
          this.tags[tag.id].value.children.push(assetData)
        } else {
          this.$set(this.tags, tag.id, {
            text: tag.name,
            value: {
              id: tag.id,
              name: tag.name,
              children: [assetData]
            }
          })
        }
      })
    })

    this.assetsData.forEach((assetData) => {
      assetData.groups.forEach((group) => {
        if (this.groups[group.id]) {
          this.groups[group.id].value.children.push(assetData)
        } else {
          this.$set(this.groups, group.id, {
            text: group.name,
            value: {
              id: group.id,
              name: group.name,
              children: [assetData]
            }
          })
        }
      })
    })
  },
  methods: {
    cancelSelection() {
      this.$emit('close')
      this.clearFields()
    },
    selectAssets() {
      this.$emit('select', this.selectedAssets)
      this.clearFields()
    },
    clearFields() {
      this.selectedSuperAssets.splice(0)
      this.selectedTags.splice(0)
      this.selectedGroups.splice(0)
    }
  }
}

/**
 * @param {number} childId
 * @param {{id: number, children: {id: number, name: number, type: string, children: any[]}[]}} assets
 * @returns {{id: number, name: number, type: string, children: any[]}[]}
 */
function getAllParents(childId, assets) {
  const parents = []
  for (const asset of assets) {
    if (asset.children) {
      const child = asset.children.find((child) => child.id === childId)
      if (child) {
        parents.push(asset)
        parents.push(...getAllParents(asset.id, assets))
      }
    }
  }
  return parents
}
</script>

<style lang="scss" scoped></style>
