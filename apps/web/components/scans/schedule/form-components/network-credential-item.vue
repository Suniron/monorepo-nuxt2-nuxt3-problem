<template>
  <v-card class="network-ip-item">
    <v-card-text>
      <v-container class="pa-0">
        <v-row align="center">
          <v-col cols="12" lg="2" class="py-0">
            <v-select
              v-model="type"
              :items="authTypes"
              label="Auth type"
              @change="credentialChanged"
            />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-text-field
              v-model="domain"
              label="Domain"
              @change="credentialChanged"
            />
          </v-col>
          <v-col cols="12" lg="3" class="py-0">
            <v-text-field
              v-model="username"
              label="Username"
              @change="credentialChanged"
            />
          </v-col>
          <template v-if="type && type !== 'ssh-key'">
            <v-col cols="12" lg="3" class="py-0">
              <v-text-field
                v-model="password"
                type="password"
                label="Password"
                @change="credentialChanged"
              />
            </v-col>
          </template>
          <template v-if="type && type === 'ssh-key'">
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="key"
                label="Private Key"
                accept=".key"
                @change="credentialChanged"
              />
            </v-col>
          </template>
          <v-col cols="auto" class="text-right py-1">
            <v-btn @click="$emit('delete')" color="primary" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WebURLItem',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      credentialId: this.data.id,
      type: this.data.type || '',
      domain: this.data.domain || '',
      username: this.data.username || '',
      password: this.data.password || '',
      key: this.data.key || null,
      authTypes: [
        { text: 'SSH', value: 'ssh' },
        { text: 'WMI', value: 'wmi' },
        { text: 'SSH-KEY', value: 'ssh-key' }
      ]
    }
  },
  methods: {
    credentialChanged() {
      const { credentialId, type, domain, username, password, key } = this
      const cred = { id: credentialId, type, domain, username, password, key }
      this.$emit('change', cred)
    }
  }
}
</script>

<style lang="scss"></style>
