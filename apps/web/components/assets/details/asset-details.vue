<script>
import { updateAssetService } from '~/services/assets'

export default {
  components: {
    AssetInfo: () => import('~/components/assets/type/AssetInfo.vue'),
  },
  data() {
    return {
      isFormValid: false,
      isLoading: false,
      formData: {}
    }
  },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  created() {},
  methods: {
    assetChanged(assetData) {
      this.formData = assetData
    },
    async saveAsset() {
      await updateAssetService(this.$axios, this.asset.id, {
        assetData: this.formData,
        name: this.formData.name,
        type: this.asset.type,
      })
      this.$root.$emit('fetchDataAgain')
    },
    saveAssetDataChange(assetData) {
      this.assetData = assetData
    },
  },
}
</script>

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
                :disabled="!isFormValid"
                :loading="isLoading"
                @click.stop="saveAsset"
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
