<template>
  <div class="text-center">
    <v-dialog v-model="isOpen" width="500">
      <v-card>
        <v-alert :type="type" class="mb-0" outlined prominent>
          <slot></slot>
        </v-alert>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ts-check
export default {
  props: {
    /**
     * Display the dialog
     */
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * By default, the modal is automatically closed after a few seconds (see **timeout**).
     */
    autoClose: {
      type: Boolean,
      required: false,
      default: true
    },
    /**
     * Useless with autoClose
     */
    timeout: {
      type: Number,
      required: false,
      default: 3000
    },
    /** @type {import('vue').PropOptions<'info'|'success'|'warning'|'error'>} */
    type: {
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      timeoutId: null
    }
  },

  watch: {
    isOpen(val) {
      if (!val) {
        // On close..
        clearTimeout(this.timeoutId)
        this.$emit('close')
        return
      }

      // On open..
      if (this.autoClose) {
        this.timeoutId = setTimeout(() => (this.isOpen = false), this.timeout) // auto close after timeout
      }
    }
  },
  mounted() {
    this.isOpen = this.show // to trigger the watch
  }
}
</script>
