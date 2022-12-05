<template>
  <v-menu
    v-model="show"
    :close-on-content-click="false"
    offset-x
    transition="scale-transition"
  >
    <template #activator="{ on, attrs }">
      <ul
        style="list-style: none; width: 280px"
        class="pl-0 d-flex justify-center"
      >
        <!-- [+] button when no affected business impacts -->
        <li v-if="affectedBusinessImpacts.length === 0">
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="primary"
            elevation="2"
            outlined
            icon
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </li>
        <!-- Else, show impacts -->
        <li
          v-for="businessImpact in affectedBusinessImpacts"
          :key="businessImpact.id"
          v-bind="attrs"
          v-on="on"
        >
          <business-impact-button
            :business-impact="{
              id: businessImpact.id,
              name: businessImpact.name
            }"
            :is-selected="isImpactAffected(businessImpact.id)"
            without-text
          />
        </li>
      </ul>
    </template>

    <v-card>
      <v-btn @click="show = false" class="close-btn" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <p class="mb-1 pt-3 px-7 caption font-italic text--secondary">
        Choose impacts you want to associate to
        <span class="font-weight-bold">{{ fearedEvent.name }}</span> event of
        <span class="font-weight-bold">{{ unit.name }}</span> unit.
      </p>
      <ul
        class="business-impact-chooser d-flex pl-0 justify-center flex-wrap"
        style="list-style: none"
      >
        <li
          v-for="businessImpact in availableBusinessImpacts"
          :key="businessImpact.id"
        >
          <v-tooltip top open-delay="750" open-on-hover>
            <template #activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <business-impact-button
                  :business-impact="businessImpact"
                  :is-selected="isImpactAffected(businessImpact.id)"
                  @impact-clicked="handleClickOnBusinessImpact"
              /></span>
            </template>
            <span>{{ getBIDesc(businessImpact.name) }}</span>
          </v-tooltip>
        </li>
      </ul>
    </v-card>
  </v-menu>
</template>

<script>
import BusinessImpactButton from './BusinessImpactButton.vue'
import { updateBusinessImpactsLinkedToMissionUnit } from '~/services/businessMissionAnalysis/index.js'
import { getBusinessImpactInfos } from '~/utils/asset.utils.js'
/**
 * @typedef {import("~/types/assets").BusinessMission} BusinessMission
 * @typedef {import("~/types/assets").BusinessUnit} BusinessUnit
 * @typedef {import("~/types/assets").BusinessImpact} BusinessImpact
 * @typedef {import("~/types/assets").FearedEvent} FearedEvent
 * @typedef {import("~/types/assets").BusinessImpactInfos} BusinessImpactInfos
 */

export default {
  components: { BusinessImpactButton },
  props: {
    /** @type {import('vue').PropOptions<BusinessUnit>} */
    unit: {
      type: Object,
      required: true
    },
    /** @type {import('vue').PropOptions<BusinessImpact[]>} */
    availableBusinessImpacts: {
      type: Array,
      required: true
    },
    /** @type {import('vue').PropOptions<FearedEvent>} */
    fearedEvent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      show: false,
      affectedBusinessImpacts: this.fearedEvent.businessImpact
    }
  },
  methods: {
    /**
     * Return **true** if the given business impact is already affected to the Business Unit.
     * @param {number} businessImpactId
     * @returns {boolean}
     */
    isImpactAffected(businessImpactId) {
      return !!this.affectedBusinessImpacts.find(
        (bi) => bi.id === businessImpactId
      )
    },
    getBIDesc(nameBusinessImpact) {
      return getBusinessImpactInfos(nameBusinessImpact).description
    },
    /**
     * Handle click on a business impact.
     * @param {BusinessImpact} businessImpact
     */
    async handleClickOnBusinessImpact(businessImpact) {
      // If already selected, remove it:
      if (this.isImpactAffected(businessImpact.id)) {
        const businessImpactToRemoveIndex = this.affectedBusinessImpacts.findIndex(
          (bi) => bi.id === businessImpact.id
        )
        this.affectedBusinessImpacts.splice(businessImpactToRemoveIndex, 1)
      } else {
        // If not selected, add it:
        this.affectedBusinessImpacts.push(businessImpact)
      }

      await this.saveInDatabase()

      // Emit new fearedEvent
      this.$emit('update:fearedEvent', {
        ...this.fearedEvent,
        businessImpact: this.affectedBusinessImpacts
      })
    },
    async saveInDatabase() {
      try {
        await updateBusinessImpactsLinkedToMissionUnit(
          this.$axios,
          this.fearedEvent.id,
          this.affectedBusinessImpacts.map((abi) => abi.id)
        )
      } catch (error) {
        // TODO: handle request fail
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.business-impact-chooser li {
  margin: 0.5rem;
}

.v-card {
  max-width: 300px;
}

.v-tooltip__content {
  width: 30% !important;
}
</style>
