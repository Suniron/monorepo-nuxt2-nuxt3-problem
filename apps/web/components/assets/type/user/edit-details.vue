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
        <v-text-field
          v-model="formData.position"
          label="Job title"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-text-field
          v-model="formData.mail"
          label="Mail"
          :rules="[mailValidation]"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-text-field
          v-model="formData.tel"
          label="Phone"
          placeholder="+999 123456789"
          :rules="[telValidation]"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="2">
        <v-select
          v-model="formData.LOCATED_TO"
          :items="selectAssets(['BUILDING'])"
          item-text="name"
          item-value="id"
          label="Located To"
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
        position: this.asset?.position,
        mail: this.asset?.mail,
        tel: this.asset?.tel,
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
      serviceParams.types = ['BUILDING']
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
    },
    mailValidation(mail) {
      const re = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
      return re.test(mail)
    },
    telValidation(tel) {
      const re = /^(\+|)[\d ]*$/
      return re.test(tel)
    }
  }
}
</script>
