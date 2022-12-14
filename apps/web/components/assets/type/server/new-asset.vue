<script>
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
        IPs: {},
        hostname: this.asset?.hostname || null,
        os: this.asset?.os || null
      },
      IPs: this.asset?.ips?.map((x) => x.address) || null
    }
  },
  created() {
    this.$root.$on('resetForm', this.resetForm)
    this.$emit('change', this.formData)
  },
  watch: {
    'formData.hostname'(newValue) {
      if (newValue?.trim() === '') {
        this.formData.hostname = null
      }
    },
    'formData.os'(newValue) {
      if (newValue?.trim() === '') {
        this.formData.os = null
      }
    }
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    resetForm() {
      this.formData = {
        IPs: {},
        hostname: this.asset?.hostname || null,
        os: this.asset?.os || null,
      }
      this.IPs = this.asset?.ips?.map(x => x.address) || null
      this.changed()
    },
    validateIPs(ips) {
      this.formData.IPs = ips.reduce(
        (arr, ip) => arr.concat(ip.split(/[,\s]/)),
        [],
      )
      this.formData.IPs = this.IPs.reduce((res, ip) => {
        res.push({ address: ip })
        return res
      }, [])
      this.$emit('change', this.formData)
    },
  },
}
</script>

<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.os"
        label="Operating System"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.hostname"
        label="Hostname"
        :disabled="!quickedit"
        @change="changed"
      />
    </v-col>
    <v-col cols="12">
      <v-combobox
        v-model="IPs"
        label="Asset IP(s)"
        multiple
        chips
        deletable-chips
        :disabled="!quickedit"
        @change="validateIPs"
      />
    </v-col>
  </div>
</template>
