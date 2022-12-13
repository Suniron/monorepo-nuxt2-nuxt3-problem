<script>
// @ts-check
import { DashItem, DashLayout, Dashboard } from 'vue-responsive-dash'
import ProjectAssignment from '~/components/dashboard/project-assignment.vue'
import SeveritySummary from '~/components/dashboard/severity-summary.vue'
import GlobalRating from '~/components/dashboard/global-rating.vue'
import TopVulnerabilities from '~/components/dashboard/top-vulnerabilities.vue'
import VulnerabilitiesHeatMap from '~/components/dashboard/vulnerabilities-heat-map.vue'
import VulnerabilityHistory from '~/components/dashboard/vulnerability-history.vue'
import ProbeStatus from '~/components/dashboard/probe-status.vue'
import AssetsCount from '~/components/dashboard/assets-count.vue'
import ComplianceSpiderGraphs from '~/components/dashboard/ComplianceSpiderGraphs.vue'

// Services
import {
  fetchDashboards,
  getDashboardData,
  updateDashboardUser,
} from '~/services/dashboard'
import AssetRisk from '~/components/dashboard/asset-risk.vue'

export default {
  components: {
    SeveritySummary,
    GlobalRating,
    TopVulnerabilities,
    VulnerabilitiesHeatMap,
    ProjectAssignment,
    VulnerabilityHistory,
    AssetRisk,
    ProbeStatus,
    AssetsCount,
    ComplianceSpiderGraphs,
    Dashboard,
    DashLayout,
    DashItem
  },
  name: 'DashboardDragPage',
  middleware: ['auth'],
  data() {
    return {
      args: {
        severitiesSummary: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        },
        global: 0,
        topVulnerabilities: [],
        likelihoods: {
          critical: {
            rare: 0,
            unlikely: 0,
            moderate: 0,
            likely: 0,
            certain: 0
          },
          high: {
            rare: 0,
            unlikely: 0,
            moderate: 0,
            likely: 0,
            certain: 0
          },
          medium: {
            rare: 0,
            unlikely: 0,
            moderate: 0,
            likely: 0,
            certain: 0
          },
          low: {
            rare: 0,
            unlikely: 0,
            moderate: 0,
            likely: 0,
            certain: 0
          }
        },
        scanHistory: [],
        assignement: {},
        riskPerAsset: {
          emergency: 0,
          low: 0,
          medium: 0,
          high: 0,
          stateOfTheArt: 0
        },
        locationSites: {
          title: 'Site locations'
        }
      },
      dlayouts: [],
      itemsTemporarilyMoving: {},
    }
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Dashboard')
    this.fetchDashboards()
    this.fetchDashboardData()
  },
  methods: {
    async addDashItem(item, layout) {
      // Improve to find first empty space that fits the item instead of the bottom row
      const maxYPlusHeight = this.nextDashboardRow(layout)
      item.visible = true
      item.x = 0
      item.y = maxYPlusHeight
      await updateDashboardUser(this.$axios, item.id, {
        visible: true,
        x: 0,
        y: maxYPlusHeight,
      })
    },
    async closeItem(item) {
      item.visible = false
      await updateDashboardUser(this.$axios, item.id, { visible: false })
    },
    async fetchDashboardData() {
      try {
        const {
          severitiesSummary,
          global,
          topVulnerabilities,
          likelihoods,
          scanHistory,
          projectAssignement,
          riskPerAsset,
        } = await getDashboardData(this.$axios)
        this.args.severitiesSummary = severitiesSummary
        this.args.global = global
        this.args.topVulnerabilities = topVulnerabilities
        this.args.likelihoods = likelihoods
        this.args.scanHistory = scanHistory
        this.$set(this.args, 'assignement', projectAssignement)
        this.args.riskPerAsset = riskPerAsset
      }
      catch (error) {
        console.error(error)
      }
    },
    async fetchDashboards() {
      const dashboards = await fetchDashboards(this.$axios)
      console.log(dashboards)
      this.dlayouts = dashboards
    },
    async moveEnd(evt) {
      await updateDashboardUser(this.$axios, evt.id, { x: evt.x, y: evt.y })
      this.$nextTick(async () => {
        await Object.keys(this.itemsTemporarilyMoving)
          .filter(itemId => parseInt(itemId) !== evt.id)
          .map((itemId) => {
            return updateDashboardUser(this.$axios, itemId, {
              x: this.itemsTemporarilyMoving[itemId].x,
              y: this.itemsTemporarilyMoving[itemId].y,
            })
          })
        this.$set(this, 'itemsTemporarilyMoving', {})
      })
    },
    nextDashboardRow(layout) {
      return layout.items
        .filter(item => item.visible)
        .reduce((acc, elt) => {
          if (elt.y + elt.height > acc)
            return elt.y + elt.height

          return acc
        }, 0)
    },
    async resizeEnd(evt, item) {
      Object.assign(item, evt)
      item.ckey
        = `${item.name
         }-${
         Math.random()
          .toString(36)
          .substring(2, 7)}`
      await updateDashboardUser(this.$axios, evt.id, {
        height: evt.height,
        width: evt.width,
      })
      this.$nextTick(async () => {
        await Object.keys(this.itemsTemporarilyMoving)
          .filter(itemId => parseInt(itemId) !== evt.id)
          .map((itemId) => {
            return updateDashboardUser(this.$axios, itemId, {
              x: this.itemsTemporarilyMoving[itemId].x,
              y: this.itemsTemporarilyMoving[itemId].y,
            })
          })
        this.$set(this, 'itemsTemporarilyMoving', {})
      })
    },
    temporaryMove(item) {
      this.$set(this.itemsTemporarilyMoving, item.id, {
        height: item.height,
        width: item.width,
        x: item.x,
        y: item.y,
      })
    },
  },
}
</script>

<template>
  <Dashboard id="dashExample">
    <DashLayout
      v-for="layout in dlayouts"
      v-bind="layout"
      :key="layout.breakpoint"
      use-css-transforms
    >
      <template v-for="item in layout.items">
        <!-- Adding both `.sync` and update events to ensure the values are correct: https://github.com/bensladden/vue-responsive-dash/issues/231 -->
        <DashItem
          v-if="item.visible"
          v-bind="item"
          :key="item.id"
          v-model:x="item.x"
          v-model:y="item.y"
          @resizeEnd="resizeEnd($event, item)"
          @update:x="temporaryMove(item)"
          @update:y="temporaryMove(item)"
          @moveEnd="moveEnd"
        >
          <component
            :is="item.name"
            :key="item.ckey"
            :data="args[item.prop]"
            @close="closeItem(item)"
          />
        </DashItem>
      </template>
      <DashItem
        id="myaddItem"
        :y="nextDashboardRow(layout)"
        :x="11"
        :width="1"
        :height="1"
      >
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <button class="add-dash-btn" v-bind="attrs" v-on="on">
              +
            </button>
          </template>
          <v-list>
            <v-list-item
              v-for="(hid, i) in layout.items.filter((elt) => !elt.visible)"
              :key="i"
            >
              <v-list-item-title @click="addDashItem(hid, layout)">
                {{
                  hid.name
                }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </DashItem>
    </DashLayout>
  </Dashboard>
</template>

<style lang="scss">
.v-card {
  height: 100%;
  width: 100%;
}

.dash-text {
  height: 80%;
  width: 100%;
}
.add-dash-btn {
  background: none;
  border: 1px dashed #2e2e2e;
  color: #5a5a5a;
  outline: none;
  border-radius: 4px;
  padding: 16px 0;

  font-size: 18px;
  width: 100%;
  height: 100%;
  // max-width: 800px;

  &[disabled] {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
  }

  &:not([disabled]):hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  &:not([disabled]):active {
    border: 1px solid #1ab342;
  }
}
</style>
