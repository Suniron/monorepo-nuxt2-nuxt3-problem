<script>
// import { mapGetters } from 'vuex'
import { searchAssetsService } from '~/services/assets'

export default {
  name: 'WebURLItem',
  data() {
    return {
      assetId: this.data.id || '',
      URL: this.data.URL || '',
      hasAuth: this.data.hasAuth || false,
      auth: {
        type: '',
        username: '',
        password: '',
        publicCrt: null,
        privateKey: null,
        caCrt: null
      },
      authTypes: [
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
      ],
      webAssetsNames: []
    }
  },
  computed: {
    // ...mapGetters('assets', ['webAssetsNames'])
  },
  created() {
    this.fetchAssetName()
  },
  methods: {
    assetModified() {
      this.$emit('change', {
        URL: this.URL,
        auth: this.auth,
        hasAuth: this.hasAuth,
        id: this.assetId,
      })
    },
    async fetchAssetName() {
      const serviceParams = {}
      serviceParams.types = ['WEB']
      serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.webAssetsNames = assets
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
  <v-card class="web-url-item">
    <v-card-text>
      <v-container class="pa-0">
        <v-row align="center">
          <v-col class="py-1">
            <v-combobox
              v-model="URL"
              :items="webAssetsNames"
              class="url-input"
              label="URL"
              @change="assetModified"
            />
          </v-col>
          <v-col cols="auto" class="text-right py-1">
            <v-btn color="primary" icon @click="$emit('delete')">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0">
            <v-checkbox
              v-model="hasAuth"
              label="Requires authentication"
              @change="assetModified"
            />
          </v-col>
        </v-row>
        <v-row v-if="hasAuth && auth">
          <v-col cols="12" lg="2" class="py-0">
            <v-select
              v-model="auth.type"
              :items="authTypes"
              label="Auth type"
              @change="assetModified"
            />
          </v-col>
          <template v-if="auth.type && auth.type !== 'certificate'">
            <v-col cols="12" lg="5" class="py-0">
              <v-text-field
                v-model="auth.username"
                label="Username"
                @change="assetModified"
              />
            </v-col>
            <v-col cols="12" lg="5" class="py-0">
              <v-text-field
                v-model="auth.password"
                type="password"
                label="Password"
                @change="assetModified"
              />
            </v-col>
          </template>
          <template v-if="auth.type && auth.type === 'certificate'">
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.publicCrt"
                label="Public Certificate"
                accept=".crt"
                @change="assetModified"
              />
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.privateKey"
                label="Private Key"
                accept=".key"
                @change="assetModified"
              />
            </v-col>
            <v-col cols="12" lg="3" class="py-0">
              <v-file-input
                v-model="auth.caCrt"
                label="CA Certificate"
                accept=".crt"
                @change="assetModified"
              />
            </v-col>
            <v-col cols="12" lg="1">
              <v-spacer />
            </v-col>
          </template>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style lang="scss"></style>
