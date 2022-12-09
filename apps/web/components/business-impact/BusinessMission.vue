<script>
// @ts-check
/**
 * @typedef {import("~/types/businessImpactAnalysis").BusinessMission} BusinessMission
 * @typedef {import("~/types/businessImpactAnalysis").BusinessUnit} BusinessUnit
 * @typedef {import("~/types/businessImpactAnalysis").BusinessImpact} BusinessImpact
 */
import AddBusinessUnitToMissionModal from '~/components/business-impact/AddBusinessUnitToMissionModal.vue'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import { searchMissionAnalysis } from '~/services/businessMissionAnalysis'
import Unit from '~/components/business-impact/unit/Unit.vue'

export default {
  components: {
    Unit,
    AddBusinessUnitToMissionModal,
    LoadingSpinner
  },
  name: 'Mission',
  props: {
    /** @type {import('vue').PropOptions<BusinessMission>} */
    currMission: {
      type: Object,
      required: false
    },
    /** @type {import('vue').PropOptions<BusinessImpact[]>} */
    availableBusinessImpacts: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: true,
      
      dialog: false,
      /** @type {BusinessUnit[]} */
units: [],
      confirmDetachmentDialogOpen: false,
      mission: this.currMission,
    }
  },
  computed: {

    /**
     * Get extra classes depending of the _completion_ of the mission.
     *
     * Note: _completion_ is defined by the completeness of business impact & severities.
     * @returns {'empty'|'completed'|'partial'}
     */
    getExtraClassesFromMission() {
      if (this.isLoading)
        return

      // if no units, mission is "empty":
      if (!this.units || this.units.length === 0)
        return 'empty'

      // If at least one unit have no affected Business Impact or Severity, mission is "partial":
      if (
        this.units.find((unit) => {
          return unit.fearedEvents.find((fearedEvent) => {
            return (
              !fearedEvent.severity || fearedEvent.businessImpact.length === 0
            )
          })
        })
      )
        return 'partial'

      // Else, all is good, mission is "completed":
      return 'completed'
    },

    /**
     * Return formatted date like '1994-04-15'
     * @returns {string} formatted date
     */
    getIsoDate() {
      const businessMissionUpdateDate = new Date(this.mission.last_update_date)

      /**
       * @type {string|number}
       */
      let dd = businessMissionUpdateDate.getDate()
      dd = dd < 10 ? `0${dd}` : dd

      /**
       * @type {string|number}
       */
      let mm = businessMissionUpdateDate.getMonth() + 1 // January is 0!
      mm = mm < 10 ? `0${mm}` : mm

      return `${businessMissionUpdateDate.getFullYear()}/${mm}/${dd}`
    },
  },
  created() {
    this.fetchBusinessUnits()
  },
  methods: {
    /**
     * Update mission units atached to mission
     */
    detachBusinessUnit(unitIdToDetach) {
      this.updateUnits(
        this.units.filter(unit => unit.unitId !== unitIdToDetach),
      )
    },
    /**
     * Fetch all business units related to the mission
     */
    async fetchBusinessUnits() {
      this.isLoading = true
      // TODO: handle request fail
      const { units } = await searchMissionAnalysis(
        // @ts-expect-error
        this.$axios,
        this.mission.id,
      )

      this.updateUnits(units)
      this.isLoading = false
    },
    /**
     * Handle one unit update (on severity update for example)
     * @param {BusinessUnit} updatedUnit
     */
    handleUnitUpdate(updatedUnit) {
      this.updateUnits(
        this.units.map(unit =>
          unit.unitId === updatedUnit.unitId ? updatedUnit : unit,
        ),
      )
    },
    /**
     * Update mission units
     * @param {BusinessUnit[]} units
     */
    updateUnits(units) {
      // Update both in units and in mission children:
      this.$set(this, 'units', units)

      this.$set(
        this.mission,
        'children',
        (this.mission.children = units.map(({ unitId, name }) => ({
          id: unitId,
          name,
        }))),
      )
    },
  },
}
</script>

<template>
  <v-expansion-panel class="mt-3 mission">
    <!-- IF WE ACTUALLY CHOSE TO OPTIMIZE THING, WE SHOULD FETCH ONLY WHEN THE USER HAS CLICKED.
    @click.once="fetchBusinessUnits(mission.id)"
    -->
    <v-expansion-panel-header :class="getExtraClassesFromMission">
      <h3>{{ mission.name }}</h3>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <LoadingSpinner v-if="isLoading" />

      <template v-else>
        <Unit
          v-for="unit in units"
          :key="unit.id"
          :available-business-impacts="availableBusinessImpacts"
          :mission="mission"
          :unit="unit"
          @detachBusinessUnit="detachBusinessUnit"
          @update:unit="handleUnitUpdate"
        />
        <AddBusinessUnitToMissionModal
          :mission="mission"
          @saved="fetchBusinessUnits"
        />
      </template>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<style lang="scss" scoped>
@import '~/assets/styles/sass/abstracts/_variables';

.mission {
  max-width: 1000px;
}

h3 {
  font-weight: normal;
}

.empty {
  background-color: $color-error;
}

.partial {
  background-color: $color-warning;
}

.completed {
  background-color: $color-success;
}
</style>
