<template>
  <div>
    <v-row>
      <v-col cols="12" lg="3">
        <v-text-field
          label="Asset Name"
          v-model="formData.name"
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
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-select
          v-model="formData.MAINTAINED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Maintainer"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
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
<script>
import { searchAssetsService } from '~/services/assets'

export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
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
  computed: {
    formTitle() {
      return this.editedAddressIndex === -1 ? 'New Address' : 'Edit Address'
    }
  },
  created() {
    this.fetchAssets()
  },
  methods: {
    async fetchAssets() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'SERVER', 'GROUP']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      console.log(assets)
      this.assets = assets
    },
    selectAssets(types) {
      const res = this.assets.filter((elt) => types.includes(elt.type))
      return res
    },
    assetChanged() {
      this.$emit('change', this.formData)
    },
    fetchRelations(rel, multiple) {
      const result = this.asset.relations
        ? this.asset?.relations.filter((elt) => {
            return elt.type === rel
          })
        : []
      if (multiple && result.length > 0) return result.map((elt) => elt.to_id)
      else if (!multiple && result.length === 1) return result[0].to_id
      else return multiple ? [] : null
    }
  }
}
</script>
