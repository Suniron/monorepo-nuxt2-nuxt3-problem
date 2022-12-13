<script>
import { uuid } from 'vue-uuid'
import _ from 'lodash'
import probesPicker from './form-components/probes-picker.vue'
import assetsPicker from './form-components/assets-picker.vue'
import baselinesPicker from './form-components/baselines-picker.vue'
import phishingScenariosPicker from './form-components/phishing-scenarios-picker.vue'
import credentialItem from './form-components/schedule-credential-item.vue'

export default {
  components: {
    probesPicker,
    assetsPicker,
    baselinesPicker,
    phishingScenariosPicker,
    credentialItem
  },
  name: 'FormByScanType',
  props: {
    scanTypes: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      // Only the 'probes' rules have been implemented in its picker component.
      // Implement the rest as needed.
      default: () => ({
        probes: [],
        assets: [],
        baselines: [],
        scenario: null,
        credentials: []
      })
    }
  },
  data() {
    return {
      creds: {
        nmap: [],
        nessus: [
          { text: 'SNMPv3', value: 'SNMPv3' },
          { text: 'SSH', value: 'SSH' },
          { text: 'Windows', value: 'Windows' }
        ],
        openvas: [
          { text: 'SNMPv3', value: 'snmpv3' },
          { text: 'SSH', value: 'ssh' },
          { text: 'Windows', value: 'windows' }
        ],
        bloodhound: [
          { text: 'Active Directory', value: 'bloodhound', required: true }
        ],
        nessus_hardening: [
          { text: 'SNMPv3', value: 'SNMPv3' },
          { text: 'SSH', value: 'SSH' },
          { text: 'Windows', value: 'Windows' }
        ],
        o365: [
          { text: 'Active Directory', value: 'bloodhound', required: true }
        ],
        edr: [{ text: 'Oauth2 (365)', value: 'edr', required: true }]
      },
      formData: {
        assets: [],
        userAssets: [],
        probe: null,
        baselines: [],
        scenario: null,
        credentials: []
      }
    }
  },
  computed: {
    /**
     * @returns {{
     *  probes: Object[];
     *  assets: Object[];
     *  baselines: Object[];
     *  scenario: number|null;
     *  credentials: Object[];
     * }}
     */
    formRules() {
      // Add default rules in case they are not defined in the props
      return {
        ...{
          assets: [],
          baselines: [],
          credentials: [],
          probes: [],
          scenario: null,
        },
        ...this.rules,
      }
    },
  },
  methods: {
    addCredential() {
      const cred = this.createCredential()
      if (cred.authTypes.length > 0)
        this.formData.credentials.push(cred)
    },
    createCredential() {
      return {
        authTypes: this.scanTypes.reduce(
          (arr, scanType) =>
            arr.concat(
              this.creds[scanType]
                ? this.creds[scanType].filter(
                  itm => !arr.some(it => it.value === itm.value),
                )
                : [],
            ),
          [],
        ),
        id: uuid.v4(),
        type: null,
      }
    },
    deleteCredential(credential) {
      const idx = this.formData.credentials.findIndex(
        cred => cred.id === credential.id,
      )

      if (idx >= 0) {
        const newCredentials = [...this.formData.credentials]
        newCredentials.splice(idx, 1)
        this.formData.credentials = newCredentials
      }
      this.$emit('updateFormData', { credentials: this.formData.credentials })
    },
    updateCredential(credential) {
      const credentialToUpdateIdx = this.formData.credentials.findIndex(
        cred => cred.id === credential.id,
      )

      if (credentialToUpdateIdx >= 0) {
        this.formData.credentials[credentialToUpdateIdx] = _.cloneDeep(
          credential,
        )
      }
      this.$emit('updateFormData', { credentials: this.formData.credentials })
    },
    validateAssets(assets) {
      this.$emit('updateFormData', { assets })
    },
    validateBaselines(baselines) {
      this.$emit('updateFormData', { baselines })
    },
    validateProbe(probe) {
      this.$emit('updateFormData', { probe })
    },
    validateScenarios(scenario) {
      this.$emit('updateFormData', { scenario })
    },
    validateUserAssets(userAssets) {
      this.$emit('updateFormData', { userAssets })
    },
  },
}
</script>

<template>
  <v-container class="pa-0">
    <probes-picker
      v-if="
        ['nmap', 'nessus', 'nessus_hardening'].some((el) =>
          scanTypes.includes(el),
        )
      "
      :rules="formRules.probes"
      @validateProbe="validateProbe"
    />
    <assets-picker
      v-if="
        ['nmap', 'nessus', 'nessus_hardening'].some((el) =>
          scanTypes.includes(el),
        )
      "
      key="server"
      :scan-type="scanTypes"
      asset-type="server"
      allow-user-input
      :rules="formRules.assets"
      @validateAssets="validateAssets"
    />
    <baselines-picker
      v-if="scanTypes.includes('nessus_hardening')"
      :rules="formRules.baselines"
      @validateBaselines="validateBaselines"
    />
    <phishing-scenarios-picker
      v-if="scanTypes.includes('phish')"
      :rules="formRules.scenario"
      @validateScenarios="validateScenarios"
    />
    <assets-picker
      v-if="scanTypes.includes('phish')"
      key="user"
      asset-type="user"
      :scan-type="scanTypes"
      :rules="formRules.assets"
      @validateUserAssets="validateUserAssets"
    />
    <credential-item
      v-for="cred of formData.credentials"
      :key="cred.id"
      :data="cred"
      :rules="formRules.credentials"
      class="mt-4"
      @change="updateCredential"
      @delete="deleteCredential(cred)"
    />
    <div
      v-if="
        ['nmap', 'nessus', 'nessus_hardening'].some((el) =>
          scanTypes.includes(el),
        )
      "
      class="mt-4"
    >
      <button
        :disabled="formData.credentials.length >= 5"
        class="add-credential-btn"
        @click="addCredential"
      >
        + Add Credential (You must select a scan type that support credentials
        first)
      </button>
    </div>
  </v-container>
</template>
