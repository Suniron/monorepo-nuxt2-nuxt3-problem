<template>
  <div>
    <v-row>
      <v-col cols="12" lg="3">
        <v-text-field
          label="Asset Name"
          v-model="formData.name"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.location"
          label="Location"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.latitude"
          type="number"
          step="0.000001"
          label="Latitude"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.longitude"
          type="number"
          step="0.000001"
          label="Longitude"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.phone_number"
          :rules="[rules.phone]"
          label="Phone number"
          placeholder="+999 123456789"
          @change="assetChanged"
        />
      </v-col>
      <v-col cols="12" lg="3">
        <v-text-field
          v-model="formData.postal_address"
          type="string"
          label="Postal adress"
          @change="assetChanged"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: this.asset?.name,
        location: this.asset?.location,
        latitude: this.asset?.latitude,
        longitude: this.asset?.longitude,
        phone_number: this.asset?.phone_number,
        postal_address: this.asset?.postal_address
      },
      assets: [],
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
    this.$emit('change', this.formData)
  },
  methods: {
    assetChanged() {
      this.$emit('change', this.formData)
    }
  }
}
</script>
