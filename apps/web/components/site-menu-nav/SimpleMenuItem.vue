<script>
// @ts-check
export default {
  computed: {
    /**
     * @returns {string} unique test idifie
     */
    testId() {
      return `navbar-${this.title.toLowerCase()}`
    }
  },
  props: {
    /**
     * Link to follow on click
     */
    to: {
      type: String,
      required: true
    },
    /**
     * Text used in item and in unique test identifier
     */
    title: {
      type: String,
      required: true
    },
    /**
     * Material Design Icon to near to item title
     */
    icon: {
      type: String,
      default: undefined
    }
  }
}
</script>

<template>
  <v-list-item nuxt :to="to" :v-test="testId">
    <!-- This slot can be used to put custom icon like in SVG -->
    <slot name="custom-icon" />

    <v-list-item-icon v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      {{ title }}
    </v-list-item-content>
  </v-list-item>
</template>
