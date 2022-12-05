<template>
  <v-menu
    v-model="show"
    offset-y
    max-width="600px"
    transition="scale-transition"
  >
    <template #activator="{ on, attrs }">
      <!-- [+] button when no affected Business Impact Severity -->
      <v-btn
        v-if="!curSeverity"
        v-bind="attrs"
        v-on="on"
        color="primary"
        elevation="2"
        outlined
        icon
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <!-- ... Else show Business Impact Severity button -->
      <v-btn
        v-else
        v-bind="attrs"
        v-on="on"
        :title="`${severityInfos.severity} - ${severityInfos.name}`"
        text
      >
        <v-icon :color="severityInfos.color">{{ severityInfos.icon }}</v-icon>
      </v-btn>
    </template>

    <!-- Modal to choose Business Impact Severity level -->
    <v-card>
      <v-card-text>
        <p class="mb-2 caption font-italic text--secondary">
          Choose severity you want to associate to
          <span class="font-weight-bold">{{ fearedEvent.name }}</span> feared
          event.
        </p>

        <ul class="pl-0">
          <li
            v-for="severity in getAllSeverities()"
            :key="severity.severity"
            class="d-flex severity-chooser-btn"
            @click="setSeverity(severity.severity)"
          >
            <v-icon :color="severity.color">{{ severity.icon }}</v-icon>
            <p class="mb-0 text-body-2">
              <span class="font-weight-bold" :style="{ color: severity.color }">
                {{ severity.severity }} - {{ severity.name }}</span
              >
              <br />
              {{ severity.description }}
            </p>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
// @ts-check
/**
 * @typedef {import("~/types/businessImpactAnalysis").FearedEvent} FearedEvent
 * @typedef {import("~/types/businessImpactAnalysis").BusinessImpactSeverityInfos} BusinessImpactSeverityInfos
 */
import { getBusinessSeverityInfos } from '~/utils/asset.utils'
import { updateFearedEventSeverity } from '~/services/fearedEvents'

export default {
  props: {
    /** @type {import('vue').PropOptions<FearedEvent>} */
    fearedEvent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      curSeverity: this.fearedEvent?.severity,
      show: false
    }
  },
  computed: {
    /**
     * Return the **business impact severity infos** if affected. Else, return **null**.
     * @returns {BusinessImpactSeverityInfos?}
     */
    severityInfos() {
      return this.curSeverity && getBusinessSeverityInfos(this.curSeverity)
    }
  },
  watch: {
    /**
     * Emit an event on each severity change
     *
     * @param {string} newSeverity
     */
    curSeverity(newSeverity) {
      // Emit feared event with updated severity:
      this.$emit('update:fearedEvent', {
        ...this.fearedEvent,
        severity: newSeverity
      })
    }
  },
  methods: {
    /**
     * Return the severities with theirs infos.
     * @returns {BusinessImpactSeverityInfos[]}
     */
    getAllSeverities() {
      return ['C1', 'C2', 'C3', 'C4', 'C5'].map((severityCode) =>
        getBusinessSeverityInfos(severityCode)
      )
    },
    /**
     * Emit an event to set the severity to the current feared event.
     * @param {string} severity code like C1, C2, C3, etc
     */
    setSeverity(severity) {
      // If severity is already set, do nothing:
      if (this.curSeverity === severity) {
        return
      }

      // Else, update/set the severity:
      try {
        // @ts-ignore
        updateFearedEventSeverity(this.$axios, severity, this.fearedEvent.id)

        this.curSeverity = severity.toLowerCase()
      } catch (error) {
        // TODO: handle request fail
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.severity-chooser-btn {
  border-radius: 3px;
}

.severity-chooser-btn:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.severity-chooser-btn > i {
  font-size: 50px;
}
</style>
