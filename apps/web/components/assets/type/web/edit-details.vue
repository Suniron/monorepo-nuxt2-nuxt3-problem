<script>
import { searchAssetsService } from '~/services/assets'

export default {
  data() {
    return {
      formData: {
        name: this.asset?.name,
        url: this.asset?.url,
        language: this.asset?.language,
        OWN_BY: this.fetchRelations('OWN_BY', true),
        MAINTAINED_BY: this.fetchRelations('MAINTAINED_BY', true),
        LOCATED_TO: this.fetchRelations('LOCATED_TO', false)
      },
      assets: []
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    formTitle() {
      return this.editedAddressIndex === -1 ? 'New Address' : 'Edit Address'
    },
  },
  created() {
    this.fetchAssets()
  },
  methods: {
    assetChanged() {
      this.$emit('change', this.formData)
    },
    async fetchAssets() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'SERVER', 'GROUP']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      console.log(assets)
      this.assets = assets
    },
    fetchRelations(rel, multiple) {
      const result = this.asset.relations
        ? this.asset?.relations.filter((elt) => {
          return elt.type === rel
        })
        : []
      if (multiple && result.length > 0)
        return result.map(elt => elt.to_id)
      else if (!multiple && result.length === 1)
        return result[0].to_id
      else return multiple ? [] : null
    },
    selectAssets(types) {
      const res = this.assets.filter(elt => types.includes(elt.type))
      return res
    },
  },
}
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.name"
          label="Asset Name"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.url"
          label="URL"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.language"
          label="LANGUAGE"
          @change="assetChanged"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="3">
        <v-select
          v-model="formData.OWN_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Owner"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-select
          v-model="formData.MAINTAINED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Maintainer"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-select
          v-model="formData.LOCATED_TO"
          :items="selectAssets(['SERVER'])"
          item-text="name"
          item-value="id"
          label="Hosted By"
          @change="assetChanged"
        />
      </v-col>
    </v-row>
  </div>
</template>
