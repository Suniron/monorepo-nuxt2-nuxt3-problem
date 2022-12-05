<template>
  <div style="width: 100%;">
    <v-col cols="12">
      <v-text-field
        v-model="formData.location"
        label="Location"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.latitude"
        type="number"
        step="0.000001"
        label="Latitude"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.longitude"
        type="number"
        step="0.000001"
        label="Longitude"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.phone_number"
        :rules="[rules.phone]"
        label="Phone number"
        placeholder="+999 123456789"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="formData.postal_address"
        type="string"
        label="Postal adress"
        @change="changed"
        :disabled="!quickedit"
      />
    </v-col>
  </div>
</template>
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
        longitude: this.asset?.longitude || null,
        latitude: this.asset?.latitude || null,
        location: this.asset?.location || null,
        phone_number: this.asset?.phone_number || null,
        postal_address: this.asset?.postal_address || null
      },
      rules: {
        phone: (value) => {
          const pattern = /^\+(\d){1,3} (\d){4,12}$/
          return !value || pattern.test(value) || 'Phone number must be valid.'
        }
      }
    }
  },
  watch: {
    'formData.phone_number'(newValue) {
      if (newValue === '') {
        this.formData.phone_number = null
      }
    }
  },
  created() {
    this.$root.$on('canceledSaves', this.canceledSaves)
    this.$emit('change', this.formData)
  },
  methods: {
    changed() {
      this.$emit('change', this.formData)
    },
    canceledSaves() {
      this.formData = {
        longitude: this.asset?.longitude || null,
        latitude: this.asset?.latitude || null,
        location: this.asset?.location || null,
        postal_address: this.asset?.postal_address || null,
        phone_number: this.asset?.phone_number || null
      }
      this.changed()
    }
  }
}
</script>
