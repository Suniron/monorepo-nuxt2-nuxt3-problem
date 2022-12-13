<script>
export default {
  name: 'WebURLItem',
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
      const cred = { domain, id: credentialId, key, password, type, username }
      this.$emit('change', cred)
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
            <v-btn color="primary" icon @click="$emit('delete')">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style lang="scss"></style>
