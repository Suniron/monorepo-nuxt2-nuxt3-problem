<template>
  <v-list-item
    link
    style="cursor: pointer"
    v-bind="bind"
    v-on="on"
    @click="$emit('click')"
  >
    <v-list-item-title>{{
      getTransitionText(transition.transition)
    }}</v-list-item-title>
    <v-list-item-action-text>
      <span class="d-flex">
        <v-icon class="ml-2">mdi-arrow-right</v-icon>
        <v-chip
          label
          :style="{
            backgroundColor: getStatusColor(transition.to_status_name)
          }"
        >
          {{ getStatusText(transition.to_status_name) }}
        </v-chip>
      </span>
    </v-list-item-action-text>
  </v-list-item>
</template>

<script>
// @ts-check

import { statusColor } from '~/utils/color.utils'

export default {
  props: {
    /**
     * @type {import('vue/types/umd').PropOptions<import('~/types/remediationProject').StatusTransition>}
     */
    transition: {
      type: Object,
      required: true
    },
    bind: {
      type: Object,
      default: () => ({})
    },
    on: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    /**
     * @param {import('../../RemediationProjectHistoryTab.vue').RemediationProjectStatus} status
     */
    getStatusText(status) {
      return this.$t(`projectManagement.statusLevel.${status}`)
    },
    getTransitionText(transitions) {
      return this.$t(`projectManagement.transitions.${transitions}`)
    },
    /**
     * @param {import('../../RemediationProjectHistoryTab.vue').RemediationProjectStatus} status
     */
    getStatusColor: (status) => statusColor(status)
  }
}
</script>
