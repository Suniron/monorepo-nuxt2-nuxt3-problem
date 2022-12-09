<script>
import { searchAssetsService } from '~/services/assets'

export default {
  data() {
    return {
      formData: {
        name: this.asset?.name,
        MAINTAINED_BY: this.fetchRelations('MAINTAINED_BY', true),
        REVIEWED_BY: this.fetchRelations('REVIEWED_BY', true),
        APPROVED_BY: this.fetchRelations('APPROVED_BY', true),
        REFERRED_TO: this.fetchRelations('REFERRED_TO', true)
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
  created() {
    this.fetchAssets()
  },
  methods: {
    assetChanged() {
      this.$emit('change', this.formData)
    },
    async fetchAssets() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'GROUP', 'POLICY', 'PROCEDURE']
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
      <v-col cols="12" lg="2">
        <v-text-field
          v-model="formData.name"
          label="Asset Name"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.MAINTAINED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Contact(s) for this document"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.REVIEWED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Reviewer(s)"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.APPROVED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Approver(s)"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.REFERRED_TO"
          :items="selectAssets(['POLICY', 'PROCEDURE'])"
          item-text="name"
          item-value="id"
          label="Refer to this document"
          multiple
          small-chips
          deletable-chips
          @change="assetChanged"
        />
      </v-col>
    </v-row>
  </div>
</template>
