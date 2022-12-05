<template>
  <div>
    <v-menu
      v-model="show"
      offset-x
      left
      nudge-left="20"
      open-on-focus
      class="ma-2"
    >
      <template #activator="{ on, attrs }">
        <div v-on="on" v-bind="attrs" class="password-with-tooltip">
          <slot />
        </div>
      </template>
      <v-card class="pa-2">
        <v-card-subtitle>
          Your password must contain at least:
        </v-card-subtitle>
        <v-card-text>
          <span v-for="check in checks" :key="check.name">
            <v-icon :color="getIconColor(check.name)">{{
              getIcon(check.name)
            }}</v-icon>
            {{ check.text }}<br />
          </span>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
/**
 * @typedef {'length'|'digit'|'lowercase'|'uppercase'|'special'} CHECKS_ENUM
 */

export default {
  props: {
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      /**
       * @type {Array<{name: CHECKS_ENUM, text: string}>}
       */
      checks: [
        {
          name: 'length',
          text: '12 characters'
        },
        {
          name: 'digit',
          text: '1 digit'
        },
        {
          name: 'lowercase',
          text: '1 lowercase character'
        },
        {
          name: 'uppercase',
          text: '1 uppercase character'
        },
        {
          name: 'special',
          text: '1 special character'
        }
      ]
    }
  },
  computed: {
    /**
     * @returns {string}
     */
    checkLength() {
      return /.{12}/.test(this.password)
    },
    /**
     * @returns {string}
     */
    checkDigit() {
      return /[0-9]/.test(this.password)
    },
    /**
     * @returns {string}
     */
    checkLowercase() {
      return /[a-z]/.test(this.password)
    },
    /**
     * @returns {string}
     */
    checkUppercase() {
      return /[A-Z]/.test(this.password)
    },
    /**
     * @returns {string}
     */
    checkSpecialChar() {
      return /[^0-9a-zA-Z]/.test(this.password)
    }
  },
  methods: {
    /**
     * @param {CHECKS_ENUM} check
     * @returns {string}
     */
    getIcon(check) {
      switch (check) {
        case 'length':
          return this.checkLength ? 'mdi-check' : 'mdi-close'
        case 'digit':
          return this.checkDigit ? 'mdi-check' : 'mdi-close'
        case 'lowercase':
          return this.checkLowercase ? 'mdi-check' : 'mdi-close'
        case 'uppercase':
          return this.checkUppercase ? 'mdi-check' : 'mdi-close'
        case 'special':
          return this.checkSpecialChar ? 'mdi-check' : 'mdi-close'
      }
    },
    /**
     * @param {CHECKS_ENUM} check
     * @returns {string}
     */
    getIconColor(check) {
      switch (check) {
        case 'length':
          return this.checkLength ? 'green' : 'red'
        case 'digit':
          return this.checkDigit ? 'green' : 'red'
        case 'lowercase':
          return this.checkLowercase ? 'green' : 'red'
        case 'uppercase':
          return this.checkUppercase ? 'green' : 'red'
        case 'special':
          return this.checkSpecialChar ? 'green' : 'red'
      }
    }
  }
}
</script>
