<template>
  <v-form v-model="isFormValid" @submit.prevent class="schedule-form">
    <v-container>
      <v-row class="schedule-form__content">
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            label="Scan Name"
            placeholder="Scan Name"
            :rules="rules.mustChar"
            solo
          />
          <v-select
            v-model="formData.types"
            placeholder="Select scan type"
            label="Select scan type"
            item-text="text"
            item-value="value"
            item-disabled="disabled"
            :items="scanTypes"
            :rules="rules.requiredList"
            solo
            multiple
            chips
            deletable-chips
          ></v-select>

          <v-switch
            v-model="enabledScheduling"
            inset
            :label="
              `Schedule scan for later (${
                enabledScheduling
                  ? 'Please specify the date'
                  : 'Scheduled for now by default'
              })`
            "
          ></v-switch>

          <CustomDateTimePicker
            v-if="enabledScheduling"
            @change="dateTimeChanged"
          />

          <form-by-scan-type
            v-if="formData.types.length > 0"
            :scan-types="formData.types"
            :rules="{
              probes: rules.required
            }"
            @updateFormData="updateFormData"
          />
        </v-col>
      </v-row>
      <v-row class="schedule-form__actions">
        <v-col cols="12" class="text-right">
          <v-alert text type="error" class="text-left" v-if="errors">
            You must select at least one credential
          </v-alert>
          <v-btn @click="() => $router.push(localePath('scans'))">
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            :disabled="!isFormValid"
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
import FormByScanType from './form-by-scan-type.vue'
import CustomDateTimePicker from './form-components/CustomDateTimePicker.vue'
// import OwnerMaintenerItem from '~/components/scans/schedule/owner-maintener-item'
// Services
import { scheduleScan } from '~/services/scans'

export default {
  name: 'ScheduleForm',
  components: {
    CustomDateTimePicker,
    FormByScanType
  },
  data() {
    return {
      errors: false,
      isFormValid: false,
      formData: {
        name: '',
        types: [],
        isInternalAsset: false,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null
      },
      rules: {
        required: [(v) => !!v || 'Field is required'],
        requiredList: [
          (v) =>
            v.length > 0 ? true : 'You must select at least one scan type'
        ],
        mustChar: [
          (v) => (v.trim().length > 0 ? true : 'The name needs a character')
        ]
      },
      enabledScheduling: false,
      isLoading: false,
      scanTypes: [
        {
          text: 'Asset Discovery',
          value: 'nmap',
          disabled: false,
          data: ['probe', 'assets']
        },
        {
          text: 'Vulnerability',
          value: 'nessus',
          disabled: false,
          data: ['probe', 'assets', 'credentials']
        },
        {
          text: 'Hardening',
          value: 'nessus_hardening',
          disabled: false,
          data: ['probe', 'assets', 'baselines', 'credentials']
        },
        {
          text: 'Phishing Simulation',
          value: 'phish',
          disabled: false,
          data: ['scenario', 'userAssets']
        },
        {
          text: 'Active Directory (On premise) [coming soon]',
          value: 'bloodhound',
          disabled: true
        },
        {
          text: 'Active Directory (O365) [coming soon]',
          value: 'o365',
          disabled: true
        },
        {
          text: 'Endpoint Detection Response [coming soon]',
          value: 'edr',
          disabled: true
        }
      ]
    }
  },
  watch: {
    'formData.types'(newTypes, oldTypes) {
      this.resetFormData(newTypes, oldTypes)
    },
    enabledScheduling() {
      this.formData.startDate = null
      this.formData.startTime = null
    }
  },
  methods: {
    resetFormData(newTypes, oldTypes) {
      this.errors = false
      if (newTypes.length < oldTypes.length) {
        const oldFields = []
        const newFields = []
        this.scanTypes.forEach((type) => {
          if (oldTypes.includes(type.value)) {
            type.data.forEach((f) => oldFields.push(f))
          }
          if (newTypes.includes(type.value)) {
            type.data.forEach((f) => newFields.push(f))
          }
        })
        const dataToDelete = oldFields.filter((x) => !newFields.includes(x))
        dataToDelete.forEach((field) => {
          delete this.formData[field]
        })
      }
    },
    updateFormData(formData) {
      this.errors = false
      Object.entries(formData).forEach(([key, value]) => {
        this.$set(this.formData, key, value)
      })
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
    async scheduleScan() {
      this.errors = false
      if (
        (this.formData.types.includes('nessus_hardening') &&
          this.formData.credentials &&
          this.formData.credentials.length !== 0) ||
        !this.formData.types.includes('nessus_hardening')
      ) {
        try {
          this.isLoading = true
          let credentials = []
          if (this.formData?.credentials) {
            const credentialsPromises = this.formData.credentials.map(
              async (credential) => {
                const item = { ...credential }
                if (
                  credential.type === 'SSH' &&
                  ['public key', 'certificate'].includes(credential.auth_method)
                ) {
                  const [privateKey] = await Promise.all([
                    credential.private_key
                      ? credential.private_key.text()
                      : Promise.resolve('')
                  ])
                  item.private_key = privateKey
                  if (credential.auth_method) {
                    const [userCert] = await Promise.all([
                      credential.user_cert
                        ? credential.user_cert.text()
                        : Promise.resolve('')
                    ])
                    item.user_cert = userCert
                  }
                } else if (credential.type == null) {
                  return {}
                }
                return item
              }
            )
            credentials = await Promise.all(credentialsPromises)
          }

          const assets = this.formData?.assets?.map((asset) => {
            return {
              ...asset,
              baselines: this.formData.baselines
            }
          })
          const params = {
            type: this.formData.types,
            name: this.formData.name,
            probe: this.formData.probe,
            hasInternal: this.formData.isInternalAsset,
            startDate: this.formData.startDate,
            endDate: this.formData.endDate,
            startTime: this.formData.startTime,
            endTime: this.formData.endTime,
            scanParams: {
              assets,
              userAssets: this.formData.userAssets,
              scenario: this.formData.scenario,
              credentials
            }
          }
          await scheduleScan(this.$axios, params)
          this.$router.push(this.localePath('scans'))
        } catch (error) {
          // fail silently
          console.log(error)
        } finally {
          this.isLoading = false
        }
      } else {
        this.errors = true
      }
    }
  }
}
</script>

<style lang="scss">
.schedule-form {
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
