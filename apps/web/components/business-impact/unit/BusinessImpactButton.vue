<script>
/** @typedef {import("~/types/businessImpactAnalysis").BusinessImpact} BusinessImpact */

export default {
  computed: {
    /**
     * Return icon name for this business impact
     * @returns {string} Material Design icon name
     */
    iconName() {
      if (!this.businessImpact.name) {
        return
      }

      switch (this.businessImpact.name.toLowerCase()) {
        case 'organizations service':
          return 'mdi-bullseye'
        case 'governance & decision':
          return 'mdi-lightbulb-outline'
        case 'financial':
          return 'mdi-cash-100'
        case 'health & safety':
          return 'mdi-charity'
        case 'intellectual property':
          return 'mdi-head-snowflake'
        case 'trust & image':
          return 'mdi-handshake'
        case 'ecological':
          return 'mdi-earth'
        case 'legal':
          return 'mdi-scale-balance'
        case 'facilities & equipment':
          return 'mdi-office-building-outline'
        case 'employee social link':
          return 'mdi-account-group'
        default:
          return 'mdi-help-circle'
      }
    },
    /**
     * Return icon color for this business impact
     * @returns {"red|grey"}
     */
    iconColor() {
      return this.isSelected ? 'red' : 'grey'
    }
  },
  props: {
    /** @type {import('vue').PropOptions<BusinessImpact>} */
    businessImpact: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    },
    /**
     * If **true**, icon only will be shown
     */
    withoutText: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    /**
     * Send an event to parent with Business Impact infos on click.
     */
    handleClick() {
      this.$emit('impact-clicked', {
        ...this.businessImpact,
        name: this.businessImpact.name,
      })
    },
  },
}
</script>

<template>
  <v-btn
    :title="businessImpact.name"
    style="min-width: 0px"
    class="p-1"
    text
    @click="handleClick"
  >
    <div class="business-impact-btn-content">
      <v-icon :color="iconColor">
        {{ iconName }}
      </v-icon>
      <span v-if="!withoutText" class="text-capitalize">{{
        businessImpact.name
      }}</span>
    </div>
  </v-btn>
</template>

<style lang="scss" scoped>
.v-btn {
  height: auto !important;
  padding: 0px !important;
}
.business-impact-btn-content {
  display: flex;
  flex-direction: column;
  max-width: 90px;
  white-space: break-spaces;
  font-size: 10px;
}
</style>
