<template>
  <v-form v-model="isFormValid" @submit.prevent class="network-form">
    <v-container>
      <v-row class="network-form__content">
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
          <v-combobox
            v-model="formData.IPs"
            :items="networkAssetsIPs"
            @change="validateIPs"
            label="List of IPs"
            solo
            multiple
            chips
            deletable-chips
          />
          <owner-maintener-item />
          <start-end-date-time-item @change="dateTimeChanged" />
          <network-credential-item
            v-for="cred of formData.credentials"
            :key="cred.id"
            :data="cred"
            @change="updateCredential"
            @delete="deleteCredential(cred)"
            class="mt-4"
          />
          <div class="mt-4">
            <button
              @click="addCredential"
              :disabled="formData.credentials.length >= 5"
              class="add-credential-btn"
            >
              + Add Credential
            </button>
          </div>
        </v-col>
      </v-row>

      <div class="internal-asset-wrapper">
        <v-checkbox
          v-model="formData.isInternalAsset"
          label="This scan contains internal IPs"
        />
      </div>

      <v-row class="network-form__actions">
        <v-col cols="12" class="text-right">
          <v-btn @click="() => $router.push(localePath('scans'))">
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            @click="scheduleScan"
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
import NetworkCredentialItem from '~/components/scans/schedule/network-credential-item'
import OwnerMaintenerItem from '~/components/scans/schedule/owner-maintener-item'

// Services
import { scheduleNetworkScan } from '~/services/scans'
import { searchProbesService } from '~/services/probes'
import { searchAssetsService } from '~/services/assets'

export default {
  name: 'ScheduleWebForm',
  components: {
    NetworkCredentialItem,
    StartEndDateTimeItem,
    OwnerMaintenerItem
  },
  data() {
    return {
      isFormValid: false,
      formData: {
        IPs: [],
        credentials: [this.createCredential()],
        isInternalAsset: false,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null
      },
      probe: null,
      probes: [],
      isLoading: false,
      networkAssetsIPs: []
    }
  },
  created() {
    this.fetchAssetName()
    this.fetchProbes()
  },
  methods: {
    async fetchAssetName() {
      const serviceParams = {}
      serviceParams.types = ['SERVER']
      serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.networkAssetsIPs = assets
    },
    fetchProbes() {
      this.probes = searchProbesService()
    },
    createCredential() {
      return {
        id: uuid.v4(),
        type: null,
        domain: '',
        username: '',
        password: '',
        key: null
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
    addCredential() {
      this.formData.credentials.push(this.createCredential())
    },
    deleteCredential(credential) {
      const idx = this.formData.credentials.findIndex(
        (cred) => cred.id === credential.id
      )

      if (idx >= 0) {
        const newCredentials = [...this.formData.credentials]
        newCredentials.splice(idx, 1)

        if (!newCredentials.length) newCredentials.push(this.createCredential())

        this.formData.credentials = newCredentials
      }
    },
    validateIPs(ips) {
      this.formData.IPs = ips.reduce(
        (arr, ip) => arr.concat(ip.split(/[,\s]/)),
        []
      )
    },
    updateCredential(credential) {
      const credentialToUpdateIdx = this.formData.credentials.findIndex(
        (cred) => cred.id === credential.id
      )

      if (credentialToUpdateIdx >= 0) {
        const newCredentials = [...this.formData.credentials]

        newCredentials[credentialToUpdateIdx] = { ...credential }

        this.formData.credentials = newCredentials
      }
    },
    async scheduleScan() {
      try {
        this.isLoading = true

        const credentialsPromises = this.formData.credentials.map(
          async (credential) => {
            const item = {
              domain: credential.domain,
              username: credential.username,
              type: credential.type
            }

            if (credential.type === 'ssh-key') {
              const [key] = await Promise.all([
                credential.key ? credential.key.text() : Promise.resolve('')
              ])

              item.key = key
            } else if (credential.type == null) {
              return {}
            } else {
              item.password = credential.password
            }

            return item
          }
        )

        const credentials = await Promise.all(credentialsPromises)
        const params = {
          ips: this.formData.IPs,
          hasInternal: this.formData.isInternalAsset,
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime
        }

        if (
          credentials.length === 1 &&
          Object.keys(credentials[0]).length === 0
        ) {
          params.credentials = []
        } else {
          params.credentials = credentials.map((cred) => ({
            type: cred.type,
            domain: cred.domain,
            username: cred.username,
            password: cred.password,
            key: cred.key
          }))
        }
        await scheduleNetworkScan(this.$axios, params)
        this.$router.push(this.localePath('scans'))
      } catch (error) {
        // fail silently
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss">
.network-form {
  &__content {
    .add-credential-btn {
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
