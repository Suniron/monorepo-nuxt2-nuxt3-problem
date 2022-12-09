<script>
import { uuid } from 'vue-uuid'
import StartEndDateTimeItem from './form-components/CustomDateTimePicker.vue'
import OwnerMaintenerItem from './form-components/owner-maintener-item.vue'
import WebUrlItem from '~/components/scans/schedule/web-url-item'
import { scheduleWebScan } from '~/services/scans'
import { searchProbesService } from '~/services/probes'

export default {
  components: {
    WebUrlItem,
    StartEndDateTimeItem,
    OwnerMaintenerItem
  },
  name: 'ScheduleWebForm',
  data() {
    return {
      formData: {
        URLs: [this.createURLData()],
        isInternalAsset: false,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        owner: null,
        maintainer: null
      },
      isFormValid: false,
      probe: null,
      isLoading: false,
      probes: []
    }
  },
  created() {
    this.fetchProbes()
  },
  methods: {
    addURL() {
      this.formData.URLs.push(this.createURLData())
    },
    createURLData() {
      return {
        URL: '',
        auth: null,
        hasAuth: false,
        id: uuid.v4(),
      }
    },
    dateTimeChanged(dateTimeData) {
      if (dateTimeData.startDate) {
        this.formData.startDate = dateTimeData.startDate
        this.formData.endDate = dateTimeData.endDate
      }
      else {
        this.formData.startTime = dateTimeData.startTime
        this.formData.endTime = dateTimeData.endTime
      }
    },
    deleteURL(URL) {
      const idx = this.formData.URLs.findIndex(url => url.id === URL.id)

      if (idx >= 0) {
        const newURLs = [...this.formData.URLs]
        newURLs.splice(idx, 1)

        if (!newURLs.length)
          newURLs.push(this.createURLData())

        this.formData.URLs = newURLs
      }
    },
    fetchProbes() {
      this.probes = searchProbesService()
    },
    ownerMaintainerChanged(ownerMaintenerData) {
      if (ownerMaintenerData.owner)
        this.formData.owner = ownerMaintenerData.owner
      else this.formData.maintainer = ownerMaintenerData.maintainer
    },
    async scheduleScan() {
      try {
        this.isLoading = true

        const assetsPromises = this.formData.URLs.map(async (asset) => {
          const item = { url: asset.URL }
          if (asset.hasAuth) {
            if (asset.auth.type === 'certificate') {
              const [publicCrt, privateKey, caCrt] = await Promise.all([
                asset.auth.publicCrt
                  ? asset.auth.publicCrt.text()
                  : Promise.resolve(''),
                asset.auth.privateKey
                  ? asset.auth.privateKey.text()
                  : Promise.resolve(''),
                asset.auth.caCrt ? asset.auth.caCrt.text() : Promise.resolve(''),
              ])

              item.auth = {
                caCrt,
                privateKey,
                publicCrt,
                type: asset.auth.type,
              }
            }
            else {
              item.auth = {
                password: asset.auth.password,
                type: asset.auth.type,
                username: asset.auth.username,
              }
            }
          }

          return item
        })
        const assets = await Promise.all(assetsPromises)
        const params = {
          assets,
          endDate: this.formData.endDate,
          endTime: this.formData.endTime,
          hasInternal: this.formData.isInternalAsset,
          startDate: this.formData.startDate,
          startTime: this.formData.startTime,
        }

        await scheduleWebScan(this.$axios, params)

        this.$router.push(this.localePath('scans'))
      }
      catch (error) {
        // silently catch
      }
      finally {
        this.isLoading = false
      }
    },
    urlItemChanged(URLData) {
      const urlToChangeIdx = this.formData.URLs.findIndex(
        url => url.id === URLData.id,
      )
      if (urlToChangeIdx >= 0) {
        const newURLs = [...this.formData.URLs]
        newURLs.splice(urlToChangeIdx, 1, URLData)

        this.formData.URLs = newURLs
      }
    },
  },
}
</script>

<template>
  <v-form v-model="isFormValid" class="web-form" @submit.prevent>
    <v-container>
      <v-row class="web-form__content">
        <v-col cols="12">
          <v-text-field label="Scan Name" placeholder="Scan Name" solo />
          <v-select
            v-model="probe"
            placeholder="Select Probe"
            label="Select Probe"
            :items="probes"
            item-text="name"
            item-value="name"
            solo
          />
          <WebUrlItem
            v-for="URL of formData.URLs"
            :key="URL.id"
            :data="URL"
            class="mt-4"
            @delete="deleteURL(URL)"
            @change="urlItemChanged"
          />
          <div class="mt-4">
            <button
              :disabled="formData.URLs.length >= 5"
              class="add-url-btn"
              @click="addURL"
            >
              + Add URL
            </button>
          </div>
        </v-col>
      </v-row>
      <OwnerMaintenerItem @change="ownerMaintainerChanged" />
      <StartEndDateTimeItem @change="dateTimeChanged" />

      <div class="internal-asset-wrapper">
        <v-checkbox
          v-model="formData.isInternalAsset"
          label="This scan contains internal URLs"
        />
      </div>

      <v-row class="web-form__actions">
        <v-col cols="12" class="text-right">
          <v-btn @click="() => $router.push(localePath('scans'))">
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            color="primary"
            class="ml-2"
            @click="scheduleScan"
          >
            Confirm scan
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style lang="scss">
.web-form {
  &__content {
    .add-url-btn {
      background: none;
      border: 1px dashed #b0b0b0;
      color: #b0b0b0;
      outline: none;
      border-radius: 4px;
      padding: 16px 0;

      font-size: 18px;
      width: 100%;
      // max-width: 800px;

      &[disabled] {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: not-allowed;
      }

      &:not([disabled]):hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
      &:not([disabled]):active {
        border: 1px solid #1ab342;
      }
    }
  }

  .internal-asset-wrapper {
    display: flex;
    justify-content: flex-end;
    margin: 8px 0;
  }
}
</style>
