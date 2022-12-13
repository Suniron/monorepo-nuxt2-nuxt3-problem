<script>
const DEFAULT_DIALOG_WIDTH = 340

export default {
  model: {
    event: 'input',
    prop: 'valueDate'
  },
  data() {
    return {
      display: false,
      date: null
    }
  },
  computed: {
    /**
     * @returns {string?}
     */
    earliestDate() {
      return (
        this.min ?? (this.allowEarlier ? undefined : new Date().toISOString())
      )
    },

    formattedDatetime: {
      /**
       * @returns {string}
       */
      get() {
        return getISODate(this.date)
      },
      /**
       * @param {string} value
       */
      set(value) {
        this.date = value ? new Date(value) : null
      },
    },
  },
  watch: {
    valueDate() {
      this.updateDate()
    },
    min(newValue) {
      const minDate = new Date(newValue)
      if (minDate > this.date) {
        this.date = null
        this.okHandler()
      }
    }
  },
  mounted() {
    this.updateDate()
  },
  methods: {
    clearHandler() {
      this.resetPicker()
      this.date = null
      this.$emit('input', this.date?.toISOString() ?? null)
      this.$emit('change', this.date?.toISOString() ?? null)
    },
    okHandler() {
      this.resetPicker()
      this.$emit('input', this.date?.toISOString() ?? null)
      this.$emit('change', this.date?.toISOString() ?? null)
    },
    resetPicker() {
      this.display = false
      this.activeTab = 0
      if (this.$refs.timer)
        this.$refs.timer.selectingHour = true
    },
    showTimePicker() {
      this.activeTab = 1
    },
    updateDate() {
      if (this.valueDate) {
        this.date = new Date(this.valueDate)
      }
      else {
        this.date = null
        this.okHandler()
      }
    },
  },
  props: {
    allowEarlier: {
      default: false,
      type: Boolean,
    },
    datePickerProps: {
      default: null,
      type: Object,
    },
    dialogWidth: {
      default: DEFAULT_DIALOG_WIDTH,
      type: Number,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    label: {
      default: '',
      type: String,
    },
    loading: {
      default: false,
      type: Boolean,
    },
    min: {
      default: null,
      type: String,
    },
    textFieldProps: {
      default: null,
      type: Object,
    },
    valueDate: {
      default: () => new Date().toISOString(),
      type: String,
    },
  },
}

function getISODate(date) {
  if (!date)
    return null

  const YYYY = date.getFullYear()
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const DD = date
    .getDate()
    .toString()
    .padStart(2, '0')

  return `${YYYY}-${MM}-${DD}`
}
</script>

<template>
  <v-dialog
    v-model="display"
    :width="dialogWidth"
    @click:outside="formattedDatetime = valueDate"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        prepend-icon="mdi-calendar"
        readonly
        color="#0C8F10"
        @click:prepend="display = true"
        @click:clear="clearHandler"
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
          v-model="formattedDatetime"
          v-bind="datePickerProps"
          full-width
          color="#0C8F10"
          :min="earliestDate"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn color="#0C8F10 lighten-1" text @click.native="clearHandler">
            Clear
          </v-btn>
          <v-btn color="#0C8F10" text @click="okHandler">
            OK
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
