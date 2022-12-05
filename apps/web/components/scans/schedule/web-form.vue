<template>
  <v-form v-model="isFormValid" @submit.prevent class="web-form">
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
          ></v-select>
          <web-url-item
            v-for="URL of formData.URLs"
            :key="URL.id"
            :data="URL"
            @delete="deleteURL(URL)"
            class="mt-4"
            @change="urlItemChanged"
          />
          <div class="mt-4">
            <button
              @click="addURL"
              :disabled="formData.URLs.length >= 5"
              class="add-url-btn"
            >
              + Add URL
            </button>
          </div>
        </v-col>
      </v-row>
      <owner-maintener-item @change="ownerMaintainerChanged" />
      <start-end-date-time-item @change="dateTimeChanged" />

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
            @click="scheduleScan"
            :loading="isLoading"
            color="primary"
            class="ml-2"
          >
            Confirm scan
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { uuid } from 'vue-uuid'
import StartEndDateTimeItem from './form-components/CustomDateTimePicker.vue'
import OwnerMaintenerItem from './form-components/owner-maintener-item.vue'
import WebUrlItem from '~/components/scans/schedule/web-url-item'
import { scheduleWebScan } from '~/services/scans'
import { searchProbesService } from '~/services/probes'

export default {
  name: 'ScheduleWebForm',
  components: {
    WebUrlItem,
    StartEndDateTimeItem,
    OwnerMaintenerItem
  },
  data() {
    return {
      isFormValid: false,
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
      probe: null,
      probes: [],
      isLoading: false
    }
  },
  created() {
    this.fetchProbes()
  },
  methods: {
    createURLData() {
      return {
        id: uuid.v4(),
        URL: '',
        auth: null,
        hasAuth: false
      }
    },
    fetchProbes() {
      this.probes = searchProbesService()
    },
    addURL() {
      this.formData.URLs.push(this.createURLData())
    },
    deleteURL(URL) {
      const idx = this.formData.URLs.findIndex((url) => url.id === URL.id)

      if (idx >= 0) {
        const newURLs = [...this.formData.URLs]
        newURLs.splice(idx, 1)

        if (!newURLs.length) newURLs.push(this.createURLData())

        this.formData.URLs = newURLs
      }
    },
    urlItemChanged(URLData) {
      const urlToChangeIdx = this.formData.URLs.findIndex(
        (url) => url.id === URLData.id
      )
      if (urlToChangeIdx >= 0) {
        const newURLs = [...this.formData.URLs]
        newURLs.splice(urlToChangeIdx, 1, URLData)

        this.formData.URLs = newURLs
      }
    },
    dateTimeChanged(dateTimeData) {
      if (dateTimeData.startDate) {
        this.formData.startDate = dateTimeData.startDate
        this.formData.endDate = dateTimeData.endDate
      } else {
        this.formData.startTime = dateTimeData.startTime
        this.formData.endTime = dateTimeData.endTime
      }
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
                asset.auth.caCrt ? asset.auth.caCrt.text() : Promise.resolve('')
              ])

              item.auth = {
                type: asset.auth.type,
                publicCrt,
                privateKey,
                caCrt
              }
            } else {
              item.auth = {
                type: asset.auth.type,
                username: asset.auth.username,
                password: asset.auth.password
              }
            }
          }

          return item
        })
        const assets = await Promise.all(assetsPromises)
        const params = {
          assets,
          hasInternal: this.formData.isInternalAsset,
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime
        }

        await scheduleWebScan(this.$axios, params)

        this.$router.push(this.localePath('scans'))
      } catch (error) {
        // silently catch
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

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
