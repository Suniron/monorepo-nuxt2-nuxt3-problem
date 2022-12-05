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
        @click:prepend="display = true"
        @click:clear="clearHandler"
        v-on="on"
        readonly
        color="#0C8F10"
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            ></v-progress-linear>
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
        ></v-date-picker>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="#0C8F10 lighten-1" text @click.native="clearHandler"
            >Clear</v-btn
          >
          <v-btn color="#0C8F10" text @click="okHandler">OK</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const DEFAULT_DIALOG_WIDTH = 340

export default {
  model: {
    prop: 'valueDate',
    event: 'input'
  },
  props: {
    datePickerProps: {
      type: Object,
      default: null
    },
    dialogWidth: {
      type: Number,
      default: DEFAULT_DIALOG_WIDTH
    },
    textFieldProps: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    allowEarlier: {
      type: Boolean,
      default: false
    },
    min: {
      type: String,
      default: null
    },
    valueDate: {
      type: String,
      default: () => new Date().toISOString()
    }
  },
  data() {
    return {
      display: false,
      date: null
    }
  },
  computed: {
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
      }
    },
    /**
     * @returns {string?}
     */
    earliestDate() {
      return (
        this.min ?? (this.allowEarlier ? undefined : new Date().toISOString())
      )
    }
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
    updateDate() {
      if (this.valueDate) {
        this.date = new Date(this.valueDate)
      } else {
        this.date = null
        this.okHandler()
      }
    },
    okHandler() {
      this.resetPicker()
      this.$emit('input', this.date?.toISOString() ?? null)
      this.$emit('change', this.date?.toISOString() ?? null)
    },
    clearHandler() {
      this.resetPicker()
      this.date = null
      this.$emit('input', this.date?.toISOString() ?? null)
      this.$emit('change', this.date?.toISOString() ?? null)
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
  }
}

function getISODate(date) {
  if (!date) {
    return null
  }
  const YYYY = date.getFullYear()
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const DD = date
    .getDate()
    .toString()
    .padStart(2, '0')

  return `${YYYY}-${MM}-${DD}`
}
</script>
