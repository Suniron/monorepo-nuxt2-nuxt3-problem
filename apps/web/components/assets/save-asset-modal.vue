<template>
  <v-card class="save-asset-modal">
    <v-card-title>
      {{ isNewAsset ? 'Create asset' : 'Edit asset' }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid" lazy-validation>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                :rules="validations.required"
                :disabled="isLoading"
                label="Asset name*"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.type"
                :items="availableAssetTypes"
                :rules="validations.required"
                :disabled="!isNewAsset"
                item-text="text"
                item-value="type"
                label="Asset type"
              ></v-select>
            </v-col>
            <template v-if="form.type && !hideAssetInfos">
              <AssetInfo
                :is-update="isUpdate"
                :asset="{ ...asset, type: form.type }"
                section="newAsset"
                @change="assetChanged"
              />
            </template>
          </v-row>

          <v-row>
            <v-col class="actions">
              <v-btn class="mr-2" :disabled="isLoading" @click.stop="cancel">
                Cancel
              </v-btn>
              <v-dialog v-model="confirmHomonym" persistent width="400">
                <template #activator="{}">
                  <v-btn
                    color="primary"
                    @click.stop="saveAsset"
                    :disabled="!isFormValid"
                    :loading="isLoading"
                    v-test="testIdentifier"
                  >
                    Save
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    >Asset {{ form.name }} already exists</v-card-title
                  >
                  <v-card-text>
                    <p>
                      There already is an asset named {{ form.name }}. Do you
                      want to create it anyway?
                    </p>
                    <p>
                      <i>
                        A number will be appended to the name.
                      </i>
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="createHomonym" color="primary"
                      >Create anyway</v-btn
                    >
                    <v-btn @click="cancelHomonym">Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="red accent-2">
      {{ text }}
      <template #action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

// Services
import {
  createAssetService,
  searchAssetsService,
  updateAssetService
} from '~/services/assets'
import AssetInfo from '~/components/assets/type/AssetInfo.vue'
import { uploadFiles } from '~/services/file_upload'
import { ASSET_TYPES } from '~/utils/asset.utils'

export default {
  name: 'SaveAssetModal',
  components: { AssetInfo },
  props: {
    asset: {
      type: Object,
      default: null
    },
    noAssetInfo: {
      type: Boolean,
      default: false
    },
    fakeSave: {
      type: Boolean,
      default: false
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    /**
     * Optionnal list of asset types name to restrict.
     *
     * **If set, others are ignored**.
     */
    allowedAssetTypes: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      snackbar: false,
      text:
        'An asset already exists with this name. Please try again with a different name.',
      timeout: 5000,
      form: {
        name: this.asset?.name || '',
        type: this.asset
          ? this.asset.type.toUpperCase()
          : this.$route.query.types
          ? this.$route.query.types.split(',').length === 1
            ? this.$route.query.types
            : null
          : null,
        assetData: {}
      },
      types: ASSET_TYPES,
      confirmHomonym: false,
      homonymModalActions: {
        confirm: () => {},
        cancel: () => {}
      },
      validations: {
        typeRules: [
          (type) =>
            type !== null &&
            this.types.filter((e) => e.Name === type).length > 0
        ],
        required: [(value) => !!value || 'Required.']
      },
      isFormValid: true,
      isNewAsset: !this.asset?.id,
      isLoading: false,
      hideAssetInfos: this.noAssetInfo
    }
  },
  computed: {
    /**
     * Return only authorized asset types
     * @returns {{type: string, text: string}[]}
     */
    availableAssetTypes() {
      if (!this.allowedAssetTypes) {
        return this.types
      }

      const restrictedTypes = this.allowedAssetTypes.map((restrictedType) =>
        restrictedType.toLowerCase()
      )

      return this.types.filter(({ type }) =>
        restrictedTypes.includes(type.toLowerCase())
      )
    },
    testIdentifier() {
      // Concetenating the type for better selection,
      // and the date to avoid duplicate errors since this is a modal that will be duplicated
      return `create-asset-modal-save-btn-${this.asset?.type ??
        'new'}-${Date.now()}`
    }
  },
  watch: {
    /**
     * When the asset type changes, we need to show the asset info in some case (add mode).
     */
    form: {
      handler(newForm) {
        if (!newForm?.type || !this.isNewAsset) {
          return
        }

        this.hideAssetInfos = false
      },
      deep: true
    }
  },
  created() {
    this.$root.$on('CHANGEPAGEFORCREATEASSET', this.restartFormInformation)
    this.$root.$on('filesChanged', this.fileUploaded)
  },
  methods: {
    ...mapActions('assets', {
      editAssetInStore: 'editAsset',
      createAssetInStore: 'createAsset'
    }),
    assetChanged(formData) {
      this.form.assetData = formData
    },
    fileUploaded(file) {
      this.file = file
    },
    createHomonym() {
      this.homonymModalActions.confirm()
    },
    cancelHomonym() {
      this.homonymModalActions.cancel()
    },
    restartFormInformation() {
      for (const elem in this.form.assetData) {
        this.form.assetData[elem] = ''
      }

      this.form = {
        name: this.asset?.name || '',
        type: this.asset
          ? this.asset.type.toUpperCase()
          : this.$route.query?.types?.split(',').length === 1
          ? this.$route.query.types
          : null,
        assetData: {}
      }
    },
    async saveAsset() {
      if (!this.$refs.form.validate()) return
      if (this.fakeSave) {
        const { name, type, assetData } = this.form

        this.$emit('saved', {
          name,
          type,
          assetData
        })

        return
      }

      try {
        if (this.file) {
          const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          const fileData = new FormData()
          fileData.append('files', this.file, this.file.name)
          const uuid = await uploadFiles(this.$axios, fileData)
          if (uuidRe.test(uuid)) {
            this.form.assetData.doc = uuid
          }
        }
        this.isLoading = true
        // const assetChanged = (asset, data) => asset.name !== data.name

        const { name, type, assetData } = this.form
        if (assetData.children) {
          assetData.children = assetData.children?.map((e) => (e.id ? e.id : e))
        }
        if (assetData.parents) {
          assetData.parents = assetData.parents?.map((e) => (e.id ? e.id : e))
        }
        if (this.isNewAsset) {
          const existing = await searchAssetsService(this.$axios, {
            search: name,
            types: [type]
          })
          const homonyms = existing.assets.find((asset) =>
            new RegExp(`^${name.trim()}( \\d+)?$`, 'i').test(asset.name.trim())
          )
          if (homonyms !== undefined) {
            this.confirmHomonym = true
            const homonymConfirm = new Promise((resolve, reject) => {
              this.homonymModalActions.confirm = resolve
              this.homonymModalActions.cancel = reject
            })
            try {
              await homonymConfirm
            } catch {
              return
            } finally {
              this.confirmHomonym = false
              this.loading = false
            }
          }
          const result = await createAssetService(this.$axios, {
            name,
            type,
            assetData
          })
          this.restartFormInformation()
          if (result.error === 'DuplicateError') {
            this.snackbar = true
          }
          this.$emit('saved', result)
        } else {
          const updatedData = {
            name,
            type,
            assetData
          }
          await updateAssetService(this.$axios, this.asset.id, updatedData)

          this.$emit('saved', updatedData)
        }
      } catch (error) {
        this.snackbar = true
        console.error(error)
      } finally {
        if (this.snackbar === false) {
          this.$emit('close')
        }
        this.$root.$emit('resetFormOnCreatingPolicyAsset')
        this.isLoading = false
      }
    },
    cancel() {
      this.restartFormInformation()
      this.$emit('close')
      this.$root.$emit('resetFormOnCreatingPolicyAsset')
      this.$root.$emit('canceledSaves')
    },
    resetField() {
      this.form = {
        name: '',
        type: this.form.type
      }
    }
  }
}
</script>

<style lang="scss">
.save-asset-modal {
  .actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
