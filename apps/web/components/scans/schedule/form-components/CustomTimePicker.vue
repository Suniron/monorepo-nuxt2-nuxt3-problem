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
      ></v-text-field>
    </template>
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs fixed-tabs v-model="activeTab" color="#000000">
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
              @input="showEndPicker"
              color="#0C8F10"
              :max="endTime"
            ></v-time-picker>
          </v-tab-item>
          <v-tab-item v-if="range" key="end">
            <v-time-picker
              ref="end"
              class="v-time-picker-custom"
              v-model="endTime"
              v-bind="endPickerProps"
              full-width
              color="#0C8F10"
              :min="startTime"
            ></v-time-picker>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="actions" :parent="this">
          <v-btn color="#0C8F10 lighten-1" text @click.native="clearHandler"
            >Clear</v-btn
          >
          <v-btn color="#0C8F10" text @click="okHandler">Ok</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  model: {
    prop: 'timeRange',
    event: 'input'
  },
  props: {
    range: {
      type: Boolean,
      default: false
    },
    timeRange: {
      type: [String, String],
      default: null
    },
    textFieldProps: {
      type: Object,
      default: null
    },
    startPickerProps: {
      type: Object,
      default: null
    },
    endPickerProps: {
      type: Object,
      default: null
    }
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
    label() {
      return this.range ? 'Time range' : 'Start time'
    },
    dateSelected() {
      return !this.date
    },
    formattedDatetime() {
      let res = ''
      if (this.startTime) res += this.startTime + ' '
      if (this.endTime) res += '~ ' + this.endTime
      return res
    }
  },
  methods: {
    okHandler() {
      this.resetPicker()
      this.$emit('change', {
        startTime: this.startTime,
        endTime: this.endTime
      })
    },
    clearHandler() {
      this.startTime = null
      this.endTime = null
      this.okHandler()
    },
    resetPicker() {
      this.modal2 = false
      this.activeTab = 0
    },
    showEndPicker() {
      this.activeTab = 1
    }
  }
}
</script>
