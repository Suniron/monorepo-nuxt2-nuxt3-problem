<script>
export default {
  model: {
    event: 'input',
    prop: 'timeRange'
  },
  data() {
    return {
      startTime: null,
      endTime: null,
      modal2: false,
      activeTab: 0,
      rules: {
        required: [(v) => !!v || 'A time is required']
      }
    }
  },
  computed: {
    dateSelected() {
      return !this.date
    },
    formattedDatetime() {
      let res = ''
      if (this.startTime)
        res += `${this.startTime} `
      if (this.endTime)
        res += `~ ${this.endTime}`
      return res
    },
    label() {
      return this.range ? 'Time range' : 'Start time'
    },
  },
  methods: {
    clearHandler() {
      this.startTime = null
      this.endTime = null
      this.okHandler()
    },
    okHandler() {
      this.resetPicker()
      this.$emit('change', {
        endTime: this.endTime,
        startTime: this.startTime,
      })
    },
    resetPicker() {
      this.modal2 = false
      this.activeTab = 0
    },
    showEndPicker() {
      this.activeTab = 1
    },
  },
  props: {
    endPickerProps: {
      default: null,
      type: Object,
    },
    range: {
      default: false,
      type: Boolean,
    },
    startPickerProps: {
      default: null,
      type: Object,
    },
    textFieldProps: {
      default: null,
      type: Object,
    },
    timeRange: {
      default: null,
      type: [String, String],
    },
  },
}
</script>

<template>
  <v-dialog ref="dialog" v-model="modal2" persistent width="290px">
    <template #activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :value="formattedDatetime"
        :rules="rules.required"
        :label="label"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-on="on"
      />
    </template>
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs v-model="activeTab" fixed-tabs color="#000000">
          <v-tab key="start">
            Start Time
          </v-tab>
          <v-tab v-if="range" key="end">
            End Time
          </v-tab>
          <v-tab-item key="start">
            <v-time-picker
              v-model="startTime"
              v-bind="startPickerProps"
              full-width
              color="#0C8F10"
              :max="endTime"
              @input="showEndPicker"
            />
          </v-tab-item>
          <v-tab-item v-if="range" key="end">
            <v-time-picker
              ref="end"
              v-model="endTime"
              class="v-time-picker-custom"
              v-bind="endPickerProps"
              full-width
              color="#0C8F10"
              :min="startTime"
            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn color="#0C8F10 lighten-1" text @click.native="clearHandler">
            Clear
          </v-btn>
          <v-btn color="#0C8F10" text @click="okHandler">
            Ok
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
