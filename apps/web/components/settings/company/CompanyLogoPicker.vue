<script>
// @ts-check
import { mapActions, mapState } from 'vuex'
import {
  getCompanyLogo,
  removeCompanyLogo,
  setCompanyLogo,
} from '~/services/companies/index.js'
import AlertPopup from '~/components/utils/AlertPopup.vue'
import { extractDataFromImage } from '~/utils/image.utils.js'

const AUTHORIZED_LOGO_FORMATS = ['image/png', 'image/jpeg', 'image/jpg']
/**
 * Divide by 1000 to obtain the size in kB
 */
const MAX_LOGO_SIZE = 100000

export default {
  components: { AlertPopup },
  computed: {
    ...mapState('company', {
      companyLogoInStore: 'logo',
    }),
  },
  data() {
    return {
      errorMessage: null,
      newLogo: null,
    }
  },
  methods: {
    ...mapActions('company', { updateCompanyLogoInStore: 'updateLogo' }),
    async fetchCompanyLogo() {
      try {
        const logo = await getCompanyLogo(this.$axios)

        if (logo === '') {
          this.updateCompanyLogoInStore(null)
          return
        }

        this.updateCompanyLogoInStore(logo)
      }
      catch (error) {
        // TODO: handle request fail
      }
    },

    async handleConfirmNewLogo() {
      if (!this.newLogo)
        return

      try {
        await setCompanyLogo(this.$axios, this.newLogo)
        this.updateCompanyLogoInStore(this.newLogo)
        this.newLogo = null // to hide preview logo
      }
      catch (error) {
        // TODO: handle request fail
      }
    },

    async handleDeleteCurrentLogo() {
      if (
        !window.confirm('Are you sure you want to delete your current logo?')
      )
        return

      try {
        await removeCompanyLogo(this.$axios)
        this.updateCompanyLogoInStore(null)
      }
      catch (error) {
        // TODO: handle request fail
      }
    },

    /**
     * Reset upload state and uploaded file infos
     */
    resetUpload() {
      this.newLogo = null
    },

    /**
     * @param {File} file uploaded file
     */
    async uploadFile(file) {
      if (!file) {
        this.resetUpload()
        return
      }
      if (!AUTHORIZED_LOGO_FORMATS.includes(file.type)) {
        this.resetUpload()
        this.errorMessage = 'Only .png, .jpg and .jpeg are authorized'
        return
      }
      if (file.size > MAX_LOGO_SIZE) {
        this.resetUpload()
        this.errorMessage = `File size is too heavy: ${Math.floor(
          file.size / 1000,
        )}kB. Max: 100kB`
        return
      }
      const imageInfos = await extractDataFromImage(file)

      if (imageInfos.width > 512 || imageInfos.height > 512) {
        this.resetUpload()
        this.errorMessage = `File dimensions are too big: ${imageInfos.width}x${imageInfos.height}. Max: 512x512`
        return
      }

      this.newLogo = imageInfos.base64
    },
  },
  mounted() {
    this.fetchCompanyLogo()
  },
}
</script>

<template>
  <v-col>
    <p class="text-caption">
      Upload your company logo in .png .jpg .jpeg, size max: 512px x 512px,
      weight max: 100kB
    </p>
    <v-file-input
      prepend-icon="mdi-camera"
      show-size
      accept="image/png, image/jpeg, image/jpg"
      label="Choose your logo"
      @change="uploadFile"
    />

    <v-row>
      <!-- NEW LOGO PREVIEW -->
      <v-card v-if="newLogo" class="ma-3" style="max-width: 200px">
        <v-card-title>New logo preview</v-card-title>
        <v-card-text>
          <v-img :src="newLogo" alt="preview-company-logo" />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="success" outlined @click="handleConfirmNewLogo">
            <v-icon>mdi-plus-circle</v-icon>
            <span>Save new logo</span>
          </v-btn>
        </v-card-actions>
        <p v-if="companyLogoInStore" class="caption text-center">
          This will erase current logo
        </p>
      </v-card>

      <!-- CURRENT COMPANY LOGO -->
      <v-card v-if="companyLogoInStore" class="ma-3" style="max-width: 200px">
        <v-card-title>Your current logo</v-card-title>
        <v-card-text>
          <v-img :src="companyLogoInStore" alt="current-company-logo" />
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="error" outlined @click="handleDeleteCurrentLogo">
            <v-icon>mdi-delete</v-icon>
            <span>Delete current</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- ERROR MESSAGE POPUP -->
    <AlertPopup
      v-if="errorMessage"
      show
      type="error"
      @close="errorMessage = ''"
    >
      {{ errorMessage }}
    </AlertPopup>
  </v-col>
</template>
