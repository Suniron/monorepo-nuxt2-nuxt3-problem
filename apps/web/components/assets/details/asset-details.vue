<template>
  <v-card>
    <v-card-title> Edit asset details </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-container>
          <AssetInfo
            :asset="asset"
            section="editDetails"
            @change="assetChanged"
          />
          <v-row>
            <v-col>
              <v-btn
                class="mr-2"
                :disabled="isLoading"
                @click.stop="$emit('close')"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                @click.stop="saveAsset"
                :disabled="!isFormValid"
                :loading="isLoading"
              >
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import { updateAssetService } from '~/services/assets'

export default {
  components: {
    AssetInfo: () => import('~/components/assets/type/AssetInfo.vue')
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFormValid: false,
      isLoading: false,
      formData: {}
    }
  },
  created() {},
  methods: {
    async saveAsset() {
      await updateAssetService(this.$axios, this.asset.id, {
        name: this.formData.name,
        type: this.asset.type,
        assetData: this.formData
      })
      this.$root.$emit('fetchDataAgain')
    },
    assetChanged(assetData) {
      this.formData = assetData
    },
    saveAssetDataChange(assetData) {
      this.assetData = assetData
    }
  }
}
</script>
