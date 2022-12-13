<script>
export default {
  name: 'WebURLItem',
  data() {
    return {
      type: this.data.type || '',
      auth: {
        id: this.data.id,
        type: this.data.type,
        auth_method: null,
        username: null,
        password: null,
        port: null,
        security_level: null,
        auth_algorithm: null,
        auth_password: null,
        privacy_algorithm: null,
        privacy_password: null,
        private_key: null,
        private_key_passphrase: null,
        user_cert: null,
        kdc: null,
        kdc_port: null,
        kdc_transport: null,
        realm: null,
        elevate_privileges_with: null,
        escalation_password: null,
        escalation_account: null,
        bin_directory: null,
        su_user: null,
        custom_password_prompt: null,
        domain: null,
        ca_crt: null,
        authTypes: this.data.authTypes
      },
      selectRequired:
        this.data.authTypes.length === 1 &&
        this.data.authTypes[0].required === true,
      authTypes: this.data.authTypes,
      securityLevel: {
        'Authentication and privacy': 0,
        'Authentication without privacy': 1,
        'No authentication and no privacy': 2
      },
      sshAuthMethod: {
        'public key': 0,
        certificate: 1,
        Kerberos: 2,
        password: 3
      },
      windowsAuthMethod: {
        Kerberos: 0,
        Password: 1
      },
      elevatePrivilegesWith: {
        Nothing: 0,
        "Cisco 'enable'": 1,
        sudo: 2,
        'su+sudo': 3,
        su: 4,
        "Checkpoint Gaia 'expert'": 5
      },
      authAlgo: ['SHA1', 'MD5'],
      privacyAlgo: ['AES', 'DES'],
      rules: {
        required: [(v) => !!v || 'Required field'],
        isNumber: [(v) => /^\d{1,5}$/.test(v) || 'Port number is required']
      },
      current: ''
      /* auth: {
        id: this.data.id,
        type: '',
        username: '',
        password: '',
        publicCrt: null,
        privateKey: null,
        caCrt: null,
        domain: this.data.domain || '',
        key: this.data.key || null
      },
      authTypes: [
        { text: 'SSH', value: 'ssh' },
        { text: 'WMI', value: 'wmi' },
        { text: 'SSH-KEY', value: 'ssh-key' },
        {
          text: 'Login form',
          value: 'login'
        },
        {
          text: 'Basic',
          value: 'basic'
        },
        {
          text: 'NTLM',
          value: 'ntlm'
        },
        {
          text: 'Digest',
          value: 'digest'
        },
        {
          text: 'Certificate',
          value: 'certificate'
        }
      ] */
    }
  },
  methods: {
    credentialChanged() {
      this.$emit('change', this.auth)
    },
    initAuthType(type) {
      if (this.auth.type === 'SNMPv3' && type === 'SNMPv3') {
        if (this.current === this.auth.type)
          return true
        this.current = this.auth.type
        this.auth.port = 161
        this.auth.security_level = 'Authentication and privacy'
        this.auth.auth_algorithm = 'SHA1'
        this.auth.privacy_algorithm = 'AES'
        return true
      }
      else if (this.auth.type === 'SSH' && type === 'SSH') {
        if (this.current === this.auth.type)
          return true
        this.current = this.auth.type
        this.auth.port = 22
        this.auth.kdc_port = 88
        this.auth.kdc_transport = 'tcp'
        this.auth.elevate_privileges_with = 'Nothing'
        return true
      }
      else if (this.auth.type === 'Windows' && type === 'Windows') {
        if (this.current === this.auth.type)
          return true
        this.current = this.auth.type
        return true
      }
      else if (this.auth.type === 'bloodhound' && type === 'bloodhound') {
        if (this.current === this.auth.type)
          return true
        this.current = this.auth.type
        return true
      }
      else if (this.auth.type === 'edr' && type === 'edr') {
        if (this.current === this.auth.type)
          return true
        this.current = this.auth.type
        return true
      }
      return false
    },
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
}
</script>

<template>
  <v-card class="network-ip-item">
    <v-card-text>
      <v-container class="pa-0">
        <v-row align="center">
          <v-col cols="12" lg="2" class="py-0">
            <v-select
              v-model="auth.type"
              :items="authTypes"
              label="Auth type"
              :rules="rules.required"
              :disabled="selectRequired"
              @change="credentialChanged"
            />
          </v-col>
          <!-- SNMPV3 creds -->
          <template v-if="initAuthType('SNMPv3')">
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.port"
                label="Port"
                :rules="rules.isNumber"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-select
                v-model="auth.security_level"
                :items="Object.keys(securityLevel)"
                label="Security Level"
                @change="credentialChanged"
              />
            </v-col>
            <!-- At least Authentication -->
            <template v-if="securityLevel[auth.security_level] <= 1">
              <v-col cols="12" lg="2" class="py-0">
                <v-select
                  v-model="auth.auth_algorithm"
                  :items="authAlgo"
                  label="Authentication algorithm"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.auth_password"
                  type="password"
                  :rules="rules.required"
                  label="Authentication password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Authentication and Privacy -->
            <template v-if="securityLevel[auth.security_level] <= 0">
              <v-col cols="12" lg="2" class="py-0">
                <v-select
                  v-model="auth.privacy_algorithm"
                  :items="privacyAlgo"
                  label="Privacy algorithm"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.privacy_password"
                  type="password"
                  :rules="rules.required"
                  label="Privacy password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
          </template>
          <!-- SSH authentication -->
          <template v-if="initAuthType('SSH')">
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-select
                v-model="auth.auth_method"
                :items="Object.keys(sshAuthMethod)"
                label="Authentication method"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <!-- Public Key -->
            <template v-if="sshAuthMethod[auth.auth_method] === 0">
              <v-col cols="12" lg="2" class="py-0">
                <v-file-input
                  v-model="auth.private_key"
                  label="Private Key"
                  :rules="rules.required"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.private_key_passphrase"
                  type="password"
                  :rules="rules.required"
                  label="Private key passphrase"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Certificate -->
            <template v-if="sshAuthMethod[auth.auth_method] === 1">
              <v-col cols="12" lg="2" class="py-0">
                <v-file-input
                  v-model="auth.user_cert"
                  label="User certificate"
                  :rules="rules.required"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-file-input
                  v-model="auth.private_key"
                  label="Private Key"
                  :rules="rules.required"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.private_key_passphrase"
                  type="password"
                  :rules="rules.required"
                  label="Private key passphrase"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Kerberos -->
            <template v-if="sshAuthMethod[auth.auth_method] === 2">
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.password"
                  type="password"
                  :rules="rules.required"
                  label="password"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.kdc"
                  :rules="rules.required"
                  label="Domain Controller"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.kdc_port"
                  :rules="rules.isNumber"
                  label="Kerberos port"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-select
                  v-model="auth.kdc_transport"
                  :items="['tcp', 'udp']"
                  label="Protocol"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.realm"
                  :rules="rules.required"
                  label="Domain Name"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Password -->
            <template v-if="sshAuthMethod[auth.auth_method] === 3">
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.password"
                  type="password"
                  :rules="rules.required"
                  label="password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <v-col cols="12" lg="2" class="py-0">
              <v-select
                v-model="auth.elevate_privileges_with"
                :items="Object.keys(elevatePrivilegesWith)"
                label="Elevate privileges with"
                @change="credentialChanged"
              />
            </v-col>
            <!-- Cisco enable -->
            <template
              v-if="elevatePrivilegesWith[auth.elevate_privileges_with] === 1"
            >
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.escalation_password"
                  type="password"
                  :rules="rules.required"
                  label="Enable password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Sudo -->
            <template
              v-if="
                [2, 3, 4].includes(
                  elevatePrivilegesWith[auth.elevate_privileges_with],
                )
              "
            >
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.escalation_account"
                  :rules="rules.required"
                  label="User"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.escalation_password"
                  type="password"
                  :rules="rules.required"
                  label="Password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <template
              v-if="elevatePrivilegesWith[auth.elevate_privileges_with] === 3"
            >
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.su_user"
                  :rules="rules.required"
                  label="Su user"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <template
              v-if="elevatePrivilegesWith[auth.elevate_privileges_with] === 5"
            >
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.escalation_password"
                  type="password"
                  :rules="rules.required"
                  label="Expert Password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
          </template>
          <!-- Windows authentication -->
          <template v-if="initAuthType('Windows')">
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-select
                v-model="auth.auth_method"
                :items="Object.keys(windowsAuthMethod)"
                label="Authentication method"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <!-- Kerberos -->
            <template v-if="windowsAuthMethod[auth.auth_method] === 0">
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.password"
                  type="password"
                  :rules="rules.required"
                  label="password"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.kdc"
                  :rules="rules.required"
                  label="Domain Controller"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.kdc_port"
                  :rules="rules.isNumber"
                  label="Kerberos port"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-select
                  v-model="auth.kdc_transport"
                  :items="['tcp', 'udp']"
                  label="Protocol"
                  @change="credentialChanged"
                />
              </v-col>
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.realm"
                  :rules="rules.required"
                  label="Domain Name"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <!-- Password -->
            <template v-if="windowsAuthMethod[auth.auth_method] === 1">
              <v-col cols="12" lg="2" class="py-0">
                <v-text-field
                  v-model="auth.password"
                  type="password"
                  :rules="rules.required"
                  label="password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
          </template>
          <!-- Bloodhound authentication -->
          <template v-if="initAuthType('bloodhound')">
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.password"
                type="password"
                :rules="rules.required"
                label="password"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.realm"
                :rules="rules.required"
                label="Domain Name"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.kdc"
                :rules="rules.required"
                label="Domain Controller"
                @change="credentialChanged"
              />
            </v-col>
          </template>
          <!-- Oaut2 365 authentication -->
          <template v-if="initAuthType('edr')">
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="TenantId"
                :rules="rules.required"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.password"
                type="password"
                :rules="rules.required"
                label="Secret"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="2" class="py-0">
              <v-text-field
                v-model="auth.realm"
                :rules="rules.required"
                label="Application"
                @change="credentialChanged"
              />
            </v-col>
          </template>
          <v-col cols="auto" class="text-right py-1">
            <v-btn
              color="primary"
              :disabled="selectRequired"
              icon
              @click="$emit('delete')"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!--- <v-row align="center">
          <v-col cols="12" lg="2" class="py-0">
            <v-select
              v-model="auth.type"
              :items="authTypes"
              label="Auth type"
              @change="credentialChanged"
            />
          </v-col>
          <template v-if="auth.type && auth.type !== 'certificate'">
            <v-col cols="12" lg="3" class="py-0">
              <v-text-field
                v-model="auth.domain"
                label="Domain"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                @change="credentialChanged"
              />
            </v-col>
            <template v-if="auth.type && auth.type !== 'ssh-key'">
              <v-col cols="12" lg="3" class="py-0">
                <v-text-field
                  v-model="auth.password"
                  type="password"
                  label="Password"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
            <template v-if="auth.type && auth.type === 'ssh-key'">
              <v-col cols="12" lg="3" class="py-0">
                <v-file-input
                  v-model="auth.key"
                  label="Private Key"
                  accept=".key"
                  @change="credentialChanged"
                />
              </v-col>
            </template>
          </template>
          <template v-if="auth.type && auth.type === 'certificate'">
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.publicCrt"
                label="Public Certificate"
                accept=".crt"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.privateKey"
                label="Private Key"
                accept=".key"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.caCrt"
                label="CA Certificate"
                accept=".crt"
                @change="credentialChanged"
              />
            </v-col>
            <v-col cols="12" lg="1"><v-spacer /></v-col>
          </template>
          <v-col cols="auto" class="text-right py-1">
            <v-btn @click="$emit('delete')" color="primary" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row> -->
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style lang="scss"></style>
