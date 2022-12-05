<template>
  <v-container class="mt-3">
    <v-row class="unit-table">
      <v-col cols="2" class="col-with-cross" @click="goToAssetPage">
        <detach-business-unit-to-mission-modal
          @saved="detachBusinessUnit"
          :unit="unit"
          :mission="mission"
        />
        <h4>{{ unit.name }}</h4>
      </v-col>
      <v-col style="padding: 0px">
        <v-data-table
          disable-filtering
          disable-pagination
          disable-sort
          :headers="headers"
          hide-default-footer
          :items="unit.fearedEvents"
        >
          <template #[`item.default`]="{ item }">
            <v-text-field v-model="item.default"></v-text-field>
          </template>
          <template #[`item.fearedEvents`]="{ item }">
            {{ item.name }}
          </template>
          <template #[`item.businessImpacts`]="{ item }">
            <BusinessImpacts
              @update:fearedEvent="handleUpdateFearedEvent"
              :unit="unit"
              :available-business-impacts="availableBusinessImpacts"
              :feared-event="item"
            />
          </template>
          <template #[`item.severity`]="{ item }">
            <!-- TODO: Ajouter les props pour gérer en interne l'update de la sévérité -->
            <Severity
              @update:fearedEvent="handleUpdateFearedEvent"
              :feared-event="item"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ts-check
/**
 * @typedef {import("~/types/businessImpactAnalysis").BusinessMission} BusinessMission
 * @typedef {import("~/types/businessImpactAnalysis").BusinessUnit} BusinessUnit
 * @typedef {import("~/types/businessImpactAnalysis").BusinessImpact} BusinessImpact
 */
import DetachBusinessUnitToMissionModal from './DetachBusinessUnitToMissionModal.vue'
import Severity from './BusinessImpactSeverity.vue'
import BusinessImpacts from '~/components/business-impact/unit/BusinessImpacts.vue'

export default {
  name: 'Unit',
  components: { BusinessImpacts, Severity, DetachBusinessUnitToMissionModal },
  props: {
    /** @type {import('vue').PropOptions<BusinessMission>} */
    mission: {
      type: Object,
      required: true
    },
    /** @type {import('vue').PropOptions<BusinessUnit>} */
    unit: {
      type: Object,
      required: true
    },
    /** @type {import('vue').PropOptions<BusinessImpact[]>} */
    availableBusinessImpacts: {
      type: Array
    }
  },
  data: () => ({
    headers: [
      {
        class: 'grey lighten-3 black--text',
        text: 'Consequences',
        value: 'fearedEvents',
        align: 'center',
        width: '30%'
      },
      {
        class: 'grey lighten-3 black--text',
        text: 'Business Impacts',
        value: 'businessImpacts',
        align: 'center',
        width: '30%'
      },
      {
        class: 'grey lighten-3 black--text',
        text: 'Severity',
        value: 'severity',
        align: 'center',
        width: '30%'
      }
    ]
  }),
  methods: {
    /**
     * @param {import('~/types/businessImpactAnalysis').FearedEvent} updatedFearedEvent
     */
    handleUpdateFearedEvent(updatedFearedEvent) {
      // Update unit with new severity:
      const updatedUnit = {
        ...this.unit,
        fearedEvents: this.unit.fearedEvents.map((fe) => {
          if (fe.id === updatedFearedEvent.id) {
            return updatedFearedEvent
          }
          return fe
        })
      }

      this.$emit('update:unit', updatedUnit)
    },
    goToAssetPage() {
      // @ts-ignore
      this.$router.push('/assets/' + this.unit.unitId)
    },
    detachBusinessUnit() {
      this.$emit('detachBusinessUnit', this.unit.unitId)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-header {
  font-weight: bold;
  color: black;
}
.unit-table {
  border: 1px solid lightgray;
  border-radius: '3px';
  box-shadow: 0px 1px 1px -2px rgb(0 0 0 / 20%),
    0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}

.unit-table .col,
.unit-table .v-data-table {
  background-color: ghostwhite;
}

.col-with-cross {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  border-right: 1px solid silver;
  border-radius: 2px;
}
.col-with-cross:hover {
  cursor: pointer;
  background-color: #eee;
}

h4 {
  text-align: center;
}
</style>
