<template>
  <v-container class="pb-5">
    <v-row align="center">
      <v-col cols="6" lg="6" class="py-0">
        <CustomDatePicker
          v-model="StartDate"
          @change="dateChanged"
        ></CustomDatePicker>
      </v-col>
      <v-col cols="6" lg="6" class="py-0"
        ><CustomTimePicker @change="timeChanged" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomDatePicker from './CustomDatePicker.vue'
import CustomTimePicker from './CustomTimePicker.vue'

export default {
  components: { CustomDatePicker, CustomTimePicker },
  data: () => ({
    StartDate: new Date(),
    EndDate: null,
    menu: false,
    menu2: false,
    textFieldProps: {
      appendIcon: 'event'
    },
    dateProps: {
      headerColor: 'red'
    },
    timeProps: {
      useSeconds: true,
      ampmInTitle: true
    }
  }),
  methods: {
    timeChanged(timeData) {
      this.$emit('change', timeData)
    },
    dateChanged(dateData) {
      this.$emit('change', dateData)
    }
  }
}
</script>
