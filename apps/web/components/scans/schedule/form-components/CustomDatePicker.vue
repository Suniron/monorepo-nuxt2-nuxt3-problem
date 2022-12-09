<script>
import { parse } from 'date-fns'

const DEFAULT_DATE = null
const DEFAULT_TIME = '00:00:00'
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'
const DEFAULT_DIALOG_WIDTH = 340
const DEFAULT_CLEAR_TEXT = 'CLEAR'
const DEFAULT_OK_TEXT = 'OK'

export default {
  model: {
    event: 'input',
    prop: 'dateRange'
  },
  data() {
    return {
      display: false,
      activeTab: 0,
      date: null,
      time: DEFAULT_TIME,
      rules: {
        required: [(v) => !!v || 'A date is required']
      }
    }
  },
  computed: {
    dateSelected() {
      return !this.date
    },
    dateTimeFormat() {
      return `${this.dateFormat} ${this.timeFormat}`
    },
    defaultDateTimeFormat() {
      return `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`
    },
    formattedDatetime() {
      return this.sortedDateRange.join(' ~ ')
      /* return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateTimeFormat)
        : '' */
    },
    label() {
      return this.range ? 'Date range' : 'Start date'
    },
    selectedDatetime() {
      if (this.date && this.time) {
        let datetimeString = `${this.date} ${this.time}`
        if (this.time.length === 5)
          datetimeString += ':00'

        return parse(datetimeString, this.defaultDateTimeFormat, new Date())
      }
      else {
        return null
      }
    },
    sortedDateRange() {
      if (!Array.isArray(this.date))
        return [this.date]
      return [...this.date].sort((a, b) => {
        return Date.parse(a) - Date.parse(b)
      })
    },
  },
  watch: {
    datetime() {
      this.init()
    },
  },
  methods: {
    okHandler() {
      this.resetPicker()
      this.$emit('input', this.selectedDatetime)
      this.$emit('change', {
        startDate: this.sortedDateRange[0],
        endDate: this.sortedDateRange[1]
      })
    },
    clearHandler() {
      this.resetPicker()
      this.date = DEFAULT_DATE
      // this.time = DEFAULT_TIME
      this.$emit('input', null)
    },
    resetPicker() {
      this.display = false
      this.activeTab = 0
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true
      }
    },
    showTimePicker() {
      this.activeTab = 1
    }
  },
  props: {
    allowEarlier: {
      default: false,
      type: Boolean,
    },
    clearText: {
      default: DEFAULT_CLEAR_TEXT,
      type: String,
    },
    dateFormat: {
      default: DEFAULT_DATE_FORMAT,
      type: String,
    },
    datePickerProps: {
      default: null,
      type: Object,
    },
    dateRange: {
      default: null,
      type: [Date, Date],
    },
    dialogWidth: {
      default: DEFAULT_DIALOG_WIDTH,
      type: Number,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    loading: {
      default: false,
      type: Boolean,
    },
    okText: {
      default: DEFAULT_OK_TEXT,
      type: String,
    },
    range: {
      default: false,
      type: Boolean,
    },
    textFieldProps: {
      default: null,
      type: Object,
    },
    timeFormat: {
      default: 'HH:mm',
      type: String,
    },
    timePickerProps: {
      default: null,
      type: Object,
    },
  },
}
</script>

<template>
  <v-dialog v-model="display" persistent :width="dialogWidth">
    <template #activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        :rules="rules.required"
        prepend-icon="mdi-calendar"
        readonly
        color="#0C8F10"
        v-on="on"
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            />
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-date-picker
          v-model="date"
          v-bind="datePickerProps"
          full-width
          color="#0C8F10"
          :min="allowEarlier ? undefined : new Date().toISOString()"
          :range="range"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn color="#0C8F10 lighten-1" text @click.native="clearHandler">
            {{
              clearText
            }}
          </v-btn>
          <v-btn color="#0C8F10" text @click="okHandler">
            {{ okText }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
