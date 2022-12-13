<script>
/**
 * @typedef {import("~/tyipes/assets").BusinessMission} BusinessMission
 * @typedef {import("~/types/businessImpactAnalysis").BusinessUnit} BusinessUnit
 * @typedef {import("~/types/businessImpactAnalysis").BusinessMissionAnalysis} BusinessMissionAnalysis
 */
import _ from 'lodash'
import { bar, bb } from 'billboard.js'
import { searchAssetsService } from '~/services/assets'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'
import { searchMissionAnalysis } from '~/services/businessMissionAnalysis'

export default {
  components: {
    LoadingSpinner
  },
  name: 'BusinessImpactSummaryHeader',
  props: {
    missions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoading: true,
      
      /**
       * @type {BusinessMissionAnalysis[]}
       */
missionsAnalysis: [],
      
      /**
       * @type {BusinessUnit[]}
       */
units: [],
      chart: null,
      chartId: `chart-${Math.floor(Math.random() * 10e6)}`,
      dialogOpen: false,
    }
  },
  computed: {

    /**
     * Returns all Business Missions whose Business analysis is completed
     * @returns {BusinessMission[]}
     */
    missionsCovered() {
      return this.missions.filter(mission =>
        this.isMissionCovered(mission.id),
      )
    },

    /**
     * Returns all Business Missions with only their incomplete Business Units
     * (empty and fully completed Business Missions are excluded)
     * @returns {BusinessMissionAnalysis[]}
     */
    missionsNotCovered() {
      return this.missionsAnalysis
        .map((missionAnalysis) => {
          return {
            ...missionAnalysis,
            units: missionAnalysis.units.filter((unit) => {
              return !this.isUnitCovered(unit)
            }),
          }
        })
        .filter(mission => mission.units.length > 0)
    },

    /**
     * Returns all Business Units linked and completed to a Business Mission
     * @returns {BusinessUnit[]}
     */
    unitsFullyCovered() {
      return this.missionsAnalysis.flatMap((analysis) => {
        return analysis.units.filter(unit => this.isUnitCovered(unit))
      }, 0)
    },

    /**
     * Returns all Business Units not linked to a Business Mission
     * @returns {BusinessUnit[]}
     */
    unitsNotCovered() {
      let unlinkedUnits = this.units
      this.unitsFullyCovered.forEach((unit) => {
        unlinkedUnits = unlinkedUnits.filter(
          unlinkedUnit => unlinkedUnit.id !== unit.unitId,
        )
      })
      this.unitsNotFullyCovered.forEach((unit) => {
        unlinkedUnits = unlinkedUnits.filter(
          unlinkedUnit => unlinkedUnit.id !== unit.unitId,
        )
      })
      return unlinkedUnits
    },

    /**
     * Returns all Business Units linked to a Business Mission but fully completed
     * @returns {BusinessUnit[]}
     */
    unitsNotFullyCovered() {
      return this.missionsAnalysis.flatMap((analysis) => {
        return analysis.units.filter(unit => !this.isUnitCovered(unit))
      }, 0)
    },
  },
  created() {
    this.fetchBusinessAssets = _.debounce(
      this.fetchBusinessAssets.bind(this),
      500
    )
    this.fetchBusinessAssets()
  },
  watch: {
    missions: {
      async handler() {
        await this.fetchBusinessAssets()
      },
      deep: true
    },
    missionsAnalysis() {
      /**
       * @type {[string, number][]}
       */
      const aggregate = this.aggregateSeverities()
      const columns = [['C1'], ['C2'], ['C3'], ['C4'], ['C5']]
      aggregate.forEach(([_, occurences], index) => {
        const data = new Array(5).fill(null)
        data[index] = occurences
        columns[index] = columns[index].concat(data)
      })
      this.chart.load({
        columns
      })
    }
  },
  mounted() {
    // Generate bar chart aggregating the missions severities
    this.chart = bb.generate({
      axis: {
        x: {
          tick: {
            format(x) {
              return `C${String(x + 1).toUpperCase()}`
            }
          }
        },
        y: {
          tick: {
            culling: {
              max: 3
            }
          }
        }
      },
      bindto: `#${this.chartId}`,
      data: {
        columns: [['C1'], ['C2'], ['C3'], ['C4'], ['C5']],
        type: bar(),
        colors: {
          C1: '#2196f3',
          C2: '#ffeb3b',
          C3: '#ff9800',
          C4: '#f44336',
          C5: '#000000'
        }
      },
      legend: {
        show: false
      },
      bar: {
        indices: {
          removeNull: true,
        },
        width: {
          ratio: 1.5,
        }
      },
    })
  },
  methods: {
    async fetchBusinessAssets() {
      this.isLoading = true
      const { assets } = await searchAssetsService(this.$axios, {
        types: ['UNIT'],
      })
      this.units = assets
      this.missionsAnalysis = await Promise.all(
        this.missions.map(mission =>
          searchMissionAnalysis(this.$axios, mission.id),
        )
      )
      this.isLoading = false
    },
    isMissionCovered(missionId) {
      if (this.missionsAnalysis.length === 0) {
        return false
      }
      const unitsAnalysis = this.missionsAnalysis.find(
        (mission) => mission.id === missionId
      ).units
      return (
        unitsAnalysis.length &&
        unitsAnalysis.every((unitAnalysis) =>
          unitAnalysis.fearedEvents.every(
            (event) =>
              event.businessImpact.length > 0 && event.severity !== null
          )
        )
      )
    },
    isUnitCovered(unitAnalysis) {
      return unitAnalysis.fearedEvents.every(
        (event) => event.businessImpact.length > 0 && event.severity !== null
      )
    },
    aggregateSeverities() {
      const severities = []
      this.missionsAnalysis.forEach((missionAnalysis) => {
        missionAnalysis.units.forEach((unitAnalysis) => {
          unitAnalysis.fearedEvents.forEach((event) => {
            if (event.severity !== null) 
              severities.push(event.severity)
            
          })
        })
      })
      const severitiesCount = _.countBy(severities)
      return ['C1', 'C2', 'C3', 'C4', 'C5'].map(severity => [
        severity,
        severitiesCount[severity] || 0,
      ])
    },
  },
}
</script>

<template>
  <div class="bia-summary-header d-flex justify-center">
    <div class="d-flex flex-column">
      <LoadingSpinner v-if="isLoading" class="flex-grow-1" />
      <span
        v-else
        class="text-h2 font-weight-bold d-flex align-center flex-grow-1"
        :class="{
          'red--text': missionsCovered.length - missions.length !== 0,
          'green--text': missionsCovered.length - missions.length === 0,
        }"
      >
        {{ missionsCovered.length }} / {{ missions.length }}
      </span>
      <div>Business Missions covered</div>
    </div>
    <div class="d-flex flex-column align-items-stretch p-relative">
      <v-dialog
        v-if="
          !isLoading && unitsNotFullyCovered.length + unitsNotCovered.length
        "
        v-model="dialogOpen"
        width="700"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="blue lighten-2"
            class="summary-unlinked-units-helper"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-help</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Business Units not covered
          </v-card-title>

          <v-divider class="mb-3" />

          <v-card-text v-if="unitsNotCovered.length">
            <v-alert border="left" colored-border type="warning" elevation="2">
              <h3>
                Some Business Units have not been linked to any Business Mission
              </h3>
              <v-divider class="mb-3" />
              <ul>
                <li v-for="unit in unitsNotCovered" :key="unit.id">
                  {{ unit.name }}
                </li>
              </ul>
            </v-alert>
          </v-card-text>

          <v-card-text v-if="missionsNotCovered.length">
            <v-alert border="left" colored-border type="warning" elevation="2">
              <h3>Some Business Units have not been fully completed</h3>
              <v-divider class="mb-3" />
              <div v-for="analysis in missionsNotCovered" :key="analysis.id">
                <h4>{{ analysis.name }}</h4>
                <ul>
                  <li
                    v-for="analysedUnit in analysis.units"
                    :key="analysedUnit.unitId"
                  >
                    {{ analysedUnit.name }}
                  </li>
                </ul>
              </div>
            </v-alert>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="dialogOpen = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <LoadingSpinner v-if="isLoading" class="flex-grow-1" />
      <span
        v-else
        class="text-h2 font-weight-bold d-flex align-center flex-grow-1"
        :class="{
          'red--text': unitsNotFullyCovered.length + unitsNotCovered.length,
          'green--text':
            unitsNotFullyCovered.length + unitsNotCovered.length === 0,
        }"
      >
        {{ unitsFullyCovered.length }} /
        {{
          unitsFullyCovered.length
            + unitsNotFullyCovered.length
            + unitsNotCovered.length
        }}
      </span>
      <div class="align-items-stretch">
        Business Units covered
      </div>
    </div>
    <div class="d-flex align-stretch flex-column">
      <span class="align-self-center">Severity breakdown</span>
      <div class="d-flex align-stretch items-center flex-grow-1">
        <LoadingSpinner
          v-if="isLoading"
          class="summary-chart-spinner align-self-center"
        />
        <div :class="{ hideChart: isLoading }">
          <div :id="chartId" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bia-summary-header {
  > div {
    flex: 1 1 0px;
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    height: 150px;
  }
}

.hideChart {
  display: none;
}

.summary-chart-spinner {
  place-self: center;
  flex-basis: 100%;
}

.summary-unlinked-units-helper {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
