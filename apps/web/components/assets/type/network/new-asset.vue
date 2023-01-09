<script>
export default {
  data() {
    return {
      formData: {
        network: this.asset?.network || null,
        netmask: this.asset?.netmask || null,
        gateway: this.asset?.gateway || null
      }
    }
  },
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
  created() {
    this.$emit('change', this.formData)
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    netMaskValidation(netmask) {
      // netmask as 255.255.255.0
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(netmask)) {
        const ip = netmask.split('.').map((octet) => {
          return parseInt(octet, 10)
        })
        const count = ip.reduce((acc, octet) => {
          return acc + octet.toString(2).split('1').length - 1
        }, 0)
        return this.validateSubnet(count)
      }// netmask as 24
      else if (/^[0-9]{1,2}$/.test(netmask)) {
        return this.validateSubnet(netmask)
      }
      else {
        return 'Netmask is not valid'
      }
    },
    validateSubnet(mask) {
      if (mask % 8 !== 0 || mask > 32) { return 'Netmask is not valid' }
      else {
        this.formData.netmask = mask
        return true
      }
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
