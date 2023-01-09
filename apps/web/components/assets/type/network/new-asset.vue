<script>
import { netmaskValid } from '~/utils/asset.utils'
export default {
  props: {
    asset: {
      type: Object,
      required: true
    },
    quickedit: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      formData: {
        network: this.asset?.network || null,
        netmask: this.asset?.netmask || null,
        gateway: this.asset?.gateway || null
      }
    }
  },
  created() {
    this.$emit('change', this.formData)
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    netMaskValidation(netmask) {
      const result = netmaskValid(netmask)
      if (result.isValid)
        this.formData.netmask = result.response
      return result.isValid || result.response
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.network"
        label="Network"
        placeholder="192.168.1.0"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.netmask"
        label="Netmask"
        placeholder="255.255.255.0 or 24"
        :disabled="!quickedit"
        :rules="[netMaskValidation]"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.gateway"
        label="Gateway"
        placeholder="192.168.1.1"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
  </div>
</template>
