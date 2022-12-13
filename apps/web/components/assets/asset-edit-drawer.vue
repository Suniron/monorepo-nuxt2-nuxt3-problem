<script>
import { searchAssetByIdService, updateAssetService } from '~/services/assets'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'

export default {
  components: { AssetInfo },
  data() {
    return {
      asset: null,
      timeout: 5000,
      snackbar: false,
      snackbarText: '',
      form: {
        name: this.asset?.name || '',
        type: this.asset?.type?.toUpperCase() || null,
        assetData: {}
      },
      types: [
        { type: 'SERVER', text: 'Server' },
        { type: 'WEB', text: 'Web' },
        { type: 'USER', text: 'User' },
        { type: 'BUILDING', text: 'Building' },
        { type: 'POLICY', text: 'Policy' },
        { type: 'PROCEDURE', text: 'Procedure' },
        { type: 'NETWORK', text: 'Network' }
      ],
      drawer: false,
      validations: {
        typeRules: [
          (type) =>
            type !== null &&
            this.types.filter((e) => e.Name === type).length > 0
        ],
        required: [(value) => !!value || 'Required.']
      },
      isFormValid: true,
      isLoading: false,
      isNewAsset: !this.asset,
      quickEdit: false
    }
  },
  props: {
    nodeSelected: {
      type: Boolean,
      default: false
    },
    assetId: {
      type: Number,
      default: -1
    }
  },
  watch: {
    assetId(newValue) {
      this.asset = null
      this.form.type = null
      this.fetchAssetById()
      this.quickEdit = false
    }
  },
  created() {
    this.drawer = this.nodeSelected
    this.fetchAssetById()
  },
  methods: {

    assetChanged(formData) {
      this.form.assetData = formData
    },

    cancel() {
      this.form.name = this.asset.name
      this.form.type = this.asset.type
      this.$root.$emit('canceledSaves')
      this.quickEdit = !this.quickEdit
    },
    /**
     * This function can be called by other components (i.e. network-diagram)
     */
    async fetchAssetById() {
      if (this.assetId !== -1) {
        this.asset = await searchAssetByIdService(this.$axios, this.assetId)
        this.form.name = this.asset.name
        this.form.type = this.asset.type.toUpperCase()
      }
      return this.asset
    },
    quickEditAsset() {
      this.quickEdit = true
    },
    async saveAsset() {
      if (!this.$refs.form.validate())
        return

      if (this.fakeSave) {
        const { name, type, assetData } = this.form

        this.$emit('saved', {
          assetData,
          name,
          type,
        })
        return
      }

      try {
        this.isLoading = true
        const assetChanged = (asset, data) => true // asset.name !== data.name

        const { name, type, assetData } = this.form
        console.log(this.form)
        if (assetChanged(this.asset, this.form)) {
          const updatedData = {
            assetData,
            name,
            type,
          }
          console.log(this.assetId, this.asset.id)
          try {
            await updateAssetService(this.$axios, this.asset.id, updatedData)
          }
          catch (error) {
            if (error.message.includes('409')) {
              this.snackbar = true
              this.snackbarText
                = 'An asset already exists with this name. Please try again with a different name.'
            }
          }

          this.$emit('saved')
        }
        // this.resetField()
        this.quickEdit = !this.quickEdit
      }
      catch (error) {
        console.error(error)
      }
      finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    width="500"
    fixed
    right
    :mobile-breakpoint="0"
  >
    <template #prepend>
      <v-row justify="center" style="margin: 5px">
        <v-col cols="10">
          <span><h1 v-if="quickEdit">Edit Details</h1>
            <h1 v-else>Summary</h1></span>
        </v-col>
        <v-col cols="2">
          <v-btn small icon @click.stop="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-divider />

    <v-card class="save-asset-modal elevation-0">
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :rules="validations.required"
                  :disabled="isLoading || !quickEdit"
                  label="Asset name*"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.type"
                  :rules="validations.required"
                  label="Asset type"
                  :items="types"
                  item-text="text"
                  item-value="type"
                  :disabled="true"
                />
              </v-col>
              <AssetInfo
                v-if="asset || form.type"
                :asset="asset ? asset : { type: form.type }"
                section="newAsset"
                :quick-edit="quickEdit"
                @change="assetChanged"
              />
            </v-row>
            <v-row>
              <v-btn
                v-show="!quickEdit"
                color="primary"
                :to="`/assets/${assetId}`"
                :disabled="!isFormValid"
                :loading="isLoading"
              >
                Asset Details
              </v-btn>
              <v-col class="actions">
                <v-btn
                  v-show="quickEdit"
                  class="mr-2"
                  :disabled="isLoading"
                  @click.stop="cancel"
                >
                  Cancel
                </v-btn>
                <v-btn
                  v-show="quickEdit"
                  color="primary"
                  :disabled="!isFormValid"
                  :loading="isLoading"
                  @click.stop="saveAsset"
                >
                  Save
                </v-btn>
                <v-btn
                  v-show="!quickEdit"
                  class="edit-asset-btn"
                  small
                  icon
                  @click.stop="quickEditAsset"
                >
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="red accent-2">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-navigation-drawer>
</template>
