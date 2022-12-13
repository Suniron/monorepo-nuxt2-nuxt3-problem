<script>
// @ts-check
import LightAssetCard from '~/components/assets/LightAssetCard.vue'
import { searchAssetsBelonging } from '~/services/assets'
import { deleteRelationByAssetsIdsService } from '~/services/relations'
import { ASSET_TYPES, allowedRelationsTypes } from '~/utils/asset.utils'
import AssetRelationModalActivator from '~/components/assets/AssetRelationModalActivator.vue'

export default {
  components: {
    AssetRelationModalActivator,
    LightAssetCard,
  },
  data() {
    return {
      relatedAssets: []
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    },
    children: {
      type: Boolean,
      default: () => false
    },
    parents: {
      type: Boolean,
      default: () => false
    },
    types: {
      type: Array,
      default: () => []
    },
    relationType: {
      type: String,
      default: 'BELONGS_TO'
    }
  },
  computed: {

    /**
     * @returns {string[]}
     */
    allowedTypes() {
      return this.types.length
        ? this.types
        : allowedRelationsTypes[this.asset.type][
          this.parents ? 'parents' : 'children'
        ]
    },

    /**
     * @returns {Array}
     */
    typedRelatedAssets() {
      return this.relatedAssets.filter(relatedAsset =>
        // @ts-expect-error
        this.allowedTypes.includes(relatedAsset.type),
      )
    },
  },
  created() {
    if (this.children === this.parents) {
      throw new Error(
        'The component "AssetRelationsList" accepts exactly one prop (to true) among "children" and "parents"',
      )
    }
    const unknownTypes = this.types.filter(
      propType => !ASSET_TYPES.find(type => type.type === propType),
    )
    if (unknownTypes.length) {
      throw new Error(
        `The component "AssetRelationsList" does not accept the following types: ${unknownTypes.join(
          ', ',
        )}`,
      )
    }
    this.fetchAsset()
  },
  methods: {
    async fetchAsset() {
      const params = this.children
        ? { parentsIds: this.asset.id }
        : { childrenIds: this.asset.id }
      const { data: relatedAssets } = await searchAssetsBelonging(
        this.$axios,
        params,
      )
      this.relatedAssets = relatedAssets.assets.filter(asset =>
        this.children
          ? asset.parentsIds.includes(this.asset.id)
          : asset.childrenIds.includes(this.asset.id),
      )
    },
    async unlinkAsset(asset) {
      try {
        await deleteRelationByAssetsIdsService(this.$axios, {
          fromAssetId: this.children ? asset.id : this.asset.id,
          relationType: this.relationType,
          toAssetId: this.children ? this.asset.id : asset.id,
        })
        this.relatedAssets.splice(
          this.relatedAssets.findIndex(ast => ast.id === asset.id),
          1,
        )
      }
      catch (error) {
        // TODO: handle request error
      }
    },
  },
}
</script>

<template>
  <div>
    <v-alert v-if="!typedRelatedAssets.length" text type="info">
      There are no assets linked
    </v-alert>
    <v-row class="my-3">
      <v-col cols="12" xs="6" sm="4" md="3" lg="2">
        <AssetRelationModalActivator
          :allowed-types="allowedTypes"
          :relation-wanted="parents ? 'parents' : 'children'"
          :asset="asset"
          :relation-type="relationType"
          @saved="fetchAsset"
        />
      </v-col>
      <v-col
        v-for="linkedAsset of typedRelatedAssets"
        :key="linkedAsset.id"
        cols="12"
        xs="6"
        sm="4"
        md="3"
        lg="2"
      >
        <LightAssetCard :asset="linkedAsset" @unlinkAsset="unlinkAsset" />
      </v-col>
    </v-row>
  </div>
</template>
