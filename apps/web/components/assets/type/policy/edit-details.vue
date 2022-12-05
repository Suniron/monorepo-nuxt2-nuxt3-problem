<template>
  <div>
    <v-row>
      <v-col cols="12" lg="2">
        <v-text-field
          label="Asset Name"
          v-model="formData.name"
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
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.REVIEWED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Reviewer(s)"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.APPROVED_BY"
          :items="selectAssets(['USER', 'GROUP'])"
          item-text="name"
          item-value="id"
          label="Approver(s)"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.REFERRED_TO"
          :items="selectAssets(['POLICY', 'PROCEDURE'])"
          item-text="name"
          item-value="id"
          label="Refer to this document"
          @change="assetChanged"
          multiple
          small-chips
          deletable-chips
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
        MAINTAINED_BY: this.fetchRelations('MAINTAINED_BY', true),
        REVIEWED_BY: this.fetchRelations('REVIEWED_BY', true),
        APPROVED_BY: this.fetchRelations('APPROVED_BY', true),
        REFERRED_TO: this.fetchRelations('REFERRED_TO', true)
      },
      assets: []
    }
  },
  created() {
    this.fetchAssets()
  },
  methods: {
    async fetchAssets() {
      const serviceParams = {}
      serviceParams.types = ['USER', 'GROUP', 'POLICY', 'PROCEDURE']
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
