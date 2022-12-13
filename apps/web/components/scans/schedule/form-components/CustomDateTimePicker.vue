<script>
import CustomDatePicker from './CustomDatePicker.vue'
import CustomTimePicker from './CustomTimePicker.vue'

export default {
  components: { CustomDatePicker, CustomTimePicker },
  data: () => ({
    EndDate: null,
    StartDate: new Date(),
    dateProps: {
      headerColor: 'red',
    },
    menu: false,
    menu2: false,
    textFieldProps: {
      appendIcon: 'event',
    },
    timeProps: {
      ampmInTitle: true,
      useSeconds: true,
    },
  }),
  methods: {
    dateChanged(dateData) {
      this.$emit('change', dateData)
    },
    timeChanged(timeData) {
      this.$emit('change', timeData)
    },
  },
}
</script>

<template>
  <v-container class="pb-5">
    <v-row align="center">
      <v-col cols="6" lg="6" class="py-0">
        <CustomDatePicker
          v-model="StartDate"
          @change="dateChanged"
        />
      </v-col>
      <v-col cols="6" lg="6" class="py-0">
        <CustomTimePicker @change="timeChanged" />
      </v-col>
    </v-row>
  </v-container>
</template>
