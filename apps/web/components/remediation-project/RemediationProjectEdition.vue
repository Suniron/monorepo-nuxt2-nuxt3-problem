<template>
  <div
    class="remediation-project-edition-form-wrapper pa-5 justify-stretch h-100"
    :class="layouts[layout]"
  >
    <v-btn-toggle
      v-model="layout"
      mandatory
      class="remediation-project-edition-form-layout-toggle"
      style="position: absolute; right: 0px; top: 0px"
    >
      <v-btn>
        <v-icon>mdi-view-list</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
    </v-btn-toggle>
    <remediation-project-creation-form
      v-model="projectSettings"
      class="remediation-project-edition-form-settings"
      :class="layouts[layout]"
    />
    <v-card
      class="
        d-flex
        flex-column
        remediation-project-edition-form-scope-selectors
        pb-5
      "
      :class="layouts[layout]"
    >
      <v-card-title>Select project scope</v-card-title>
      <div class="pl-10">
        <grouped-remediation-selector
          :grouped-remediations="groupedRemediations"
          @add-remediation-cluster="addRemediationCluster"
        />
        <span class="p-relative"
          ><span
            class="
              remediation-project-selector-separator
              mt-2
              d-flex
              align-center
            "
            ><span>OR</span></span
          ></span
        >
        <AssetVulnerabilitySelector
          class="mt-4"
          :assets-belongings="assetsBelongings"
          :vulnerabilities="vulnerabilities"
          @add-asset-vulnerabilities="addAssetVulnerabilities"
        />
      </div>
    </v-card>
    <v-card
      class="remediation-project-edition-form-scope-view d-flex flex-column"
      :class="layouts[layout]"
    >
      <div class="d-flex justify-space-between">
        <v-card-title>Preview project scope</v-card-title>
        <v-text-field
          v-model="scopeFilter"
          label="Filter"
          clearable
          class="remediation-project-edition-form-filter shrink"
        ></v-text-field>
        <v-select
          :items="scopeGroups"
          v-model="scopeGroup"
          item-text="text"
          item-value="value"
          clearable
          class="shrink"
          label="Group by"
          placeholder="Group by"
          :menu-props="{
            bottom: true,
            offsetY: true,
            closeOnClick: true
          }"
        >
        </v-select>
        <v-btn
          class="ma-4"
          v-if="selectedScopeElements.length"
          @click="clearScope"
          >Remove {{ selectedScopeElements.length }} element{{
            selectedScopeElements.length > 1 ? 's' : ''
          }}</v-btn
        >
        <v-btn class="ma-4" v-else @click="clearScope"
          >Clear project scope</v-btn
        >
      </div>
      <remediation-project-scope
        class="h-100"
        v-model="selectedScopeElements"
        :filter="scopeFilter"
        :selected-group="scopeGroup"
        :scope="scope"
      />
    </v-card>
    <div
      class="remediation-project-edition-form-actions d-flex justify-end ma-5"
      :class="layouts[layout]"
    >
      <v-btn
        color="primary"
        :disabled="!isProjectFormComplete"
        @click="createProject"
        >Create project</v-btn
      >
    </div>
  </div>
</template>

<script>
// @ts-check
import RemediationProjectCreationForm from './RemediationProjectCreationForm.vue'
import RemediationProjectScope from './RemediationProjectScope.vue'
import GroupedRemediationSelector from './selectors/GroupedRemediationsSelector.vue'
import AssetVulnerabilitySelector from './selectors/AssetVulnerabilitySelector.vue'
import { searchAssetsBelonging } from '~/services/assets'
import { searchVulnerabilitiesWithTheirAssetsService } from '~/services/vulnerabilities'
import {
  searchGroupedRemediationsService,
  createRemediationProjectService
} from '~/services/remediation-projects'

/**
 * @typedef {{
 *  source: {
 *    type: 'CLUSTER'|'SUPERASSET'
 *    id: number,
 *    name: string,
 *  },
 *  asset: {
 *   id: number,
 *   name: string,
 *  },
 *  vulnerability: {
 *    id: number,
 *    name: string,
 *    vastId: number,
 *  }
 * }} ScopeType
 */

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   description: string,
 *   creationDate: string,
 *   startDate: string,
 *   deadline: string,
 *   assignees: string[],
 *   owner: string,
 *   priority: number
 * }} ProjectData
 */

export default {
  components: {
    RemediationProjectCreationForm,
    RemediationProjectScope,
    GroupedRemediationSelector,
    AssetVulnerabilitySelector
  },
  props: {
    isSave: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /**
       * @type {ProjectData}
       */
      projectSettings: {
        id: '',
        name: '',
        description: '',
        creationDate: '',
        startDate: '',
        deadline: '',
        assignees: [],
        owner: null,
        priority: null
      },
      /**
       * @type {{
       *  clusterId: number;
       *  remediation: string;
       *  count_vuln: number,
       *  count_asset: number,
       *  count_asset_vuln: number,
       *  count_asset_vuln_unmanaged: number,
       * }[]}
       */
      groupedRemediations: [],
      /**
       * @type {import('~/services/assets').AssetWithRelations[]}
       */
      assetsBelongings: [],
      /**
       * @type {import('~/services/vulnerabilities').VulnerabilityWithAssets[]}
       */
      vulnerabilities: [],
      /**
       * @type {ScopeType[]}
       */
      scope: [],
      selectedScopeElements: [],
      scopeFilter: '',
      scopeGroups: [
        { value: 'source.name', text: 'Source' },
        { value: 'asset.name', text: 'Asset' },
        { value: 'vulnerability.name', text: 'Vulnerability' }
      ],
      scopeGroup: null,
      layout: 0,
      layouts: ['list-layout', 'grid-layout']
    }
  },
  computed: {
    /**
     * @returns {Boolean}
     */
    isProjectFormComplete() {
      return Boolean(
        this.projectSettings.name?.trim().length > 0 &&
          this.projectSettings.description?.trim().length > 0 &&
          this.projectSettings.startDate?.trim().length > 0 &&
          this.projectSettings.deadline?.trim().length > 0 &&
          this.projectSettings.assignees.length > 0 &&
          this.projectSettings.owner &&
          this.projectSettings.priority &&
          this.scope.length > 0
      )
    }
  },
  async created() {
    const { data } = await searchGroupedRemediationsService(this.$axios)
    this.groupedRemediations = data.sort(
      (rem1, rem2) =>
        rem2.count_asset_vuln_unmanaged - rem1.count_asset_vuln_unmanaged
    )

    const { data: assetsBelongings } = await searchAssetsBelonging(this.$axios)
    this.assetsBelongings = assetsBelongings.assets

    const {
      vulnerabilities
    } = await searchVulnerabilitiesWithTheirAssetsService(this.$axios)

    this.vulnerabilities = vulnerabilities
  },
  methods: {
    /**
     * @param {import('./selectors/GroupedRemediationsSelector.vue').GroupedRemediation} cluster
     */
    addRemediationCluster(cluster) {
      /**
       * @type {{
       *  clusterId: number,
       *  vastId: number,
       *  assetType: number,
       *  id: number,
       *  name: string,
       *  vulnId: number,
       *  vulnName: string
       * }[]}
       */
      const affectedAssetsOfCluster = this.vulnerabilities
        .filter(
          (vulnerability) => vulnerability.clusterId === cluster.clusterId
        )
        .flatMap((vulnerability) => {
          return vulnerability.affectedAssets
            .filter(
              (affectedAsset) =>
                affectedAsset.projects.length === 0 &&
                affectedAsset.status !== 'remediated'
            )
            .map((asset) => {
              return {
                clusterId: cluster.clusterId,
                vastId: asset.vastId,
                assetType: asset.assetType,
                id: asset.id,
                name: asset.name,
                vulnId: vulnerability.id,
                vulnName: vulnerability.name
              }
            })
        })

      affectedAssetsOfCluster.forEach((affectedAsset) => {
        // Checking if vastId is already in the scope
        const isVastIdAlreadyInScope = this.scope.some(
          (scope) => scope.vulnerability.vastId === affectedAsset.vastId
        )
        if (isVastIdAlreadyInScope) {
          return
        }

        this.scope.push({
          source: {
            type: 'CLUSTER',
            id: affectedAsset.vulnId,
            name: cluster.remediation
          },
          asset: {
            id: affectedAsset.id,
            name: affectedAsset.name
          },
          vulnerability: {
            id: affectedAsset.vulnId,
            name: affectedAsset.vulnName,
            vastId: affectedAsset.vastId
          }
        })
      })
    },
    /**
     * @param {{
     *  asset: {id: number, name: string, type: string, childrenIds: number[]},
     *  vulnerabilities: {id: number, name: string, vastId: number}[]
     * }} param0
     */
    addAssetVulnerabilities({ asset, vulnerabilities }) {
      vulnerabilities.forEach((vulnerability) => {
        // Checking if vastId is already in the scope
        const isVastIdAlreadyInScope = this.scope.some(
          (scope) => scope.vulnerability.vastId === vulnerability.vastId
        )
        if (isVastIdAlreadyInScope) {
          return
        }
        const assetVulnerability = this.vulnerabilities
          .find((v) => v.id === vulnerability.id)
          .affectedAssets.find((a) => a.vastId === vulnerability.vastId)
        this.scope.push({
          source: {
            type: 'SUPERASSET',
            id: asset.id,
            name: asset.name
          },
          asset: {
            id: assetVulnerability.id,
            name: assetVulnerability.name
          },
          vulnerability: {
            id: vulnerability.id,
            name: vulnerability.name,
            vastId: vulnerability.vastId
          }
        })
      })
    },
    clearScope() {
      if (this.selectedScopeElements.length) {
        this.selectedScopeElements.forEach((element) => {
          this.scope.splice(this.scope.indexOf(element), 1)
        })
        this.selectedScopeElements.splice(0)
      } else {
        this.scope.splice(0)
      }
    },
    async createProject() {
      const id = await createRemediationProjectService(this.$axios, {
        name: this.projectSettings.name,
        description: this.projectSettings.description,
        due_date: this.projectSettings.deadline,
        start_date: this.projectSettings.startDate,
        assignees: this.projectSettings.assignees,
        owner: this.projectSettings.owner,
        priority: this.projectSettings.priority,
        project_scope: this.scope.map(
          (scopeElement) => scopeElement.vulnerability.vastId
        )
      })
      // @ts-ignore
      this.$router.push(`/remediation-projects/${id}`)
    }
  }
}
</script>

<style lang="scss">
.remediation-project-edition-form {
  &-layout-toggle {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 2;
  }

  &-wrapper {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(16, auto);
    // grid-auto-rows: minmax(1fr, auto);
    grid-column-gap: 15px;
    grid-row-gap: 15px;
  }

  &-settings {
    &.list-layout {
      grid-area: 1 / 2 / 3 / 7;
    }
    &.grid-layout {
      grid-area: 1 / 1 / 17 / 3;
      & .v-card {
        padding-bottom: 50px;
      }
    }
  }
  &-scope-selectors {
    &.list-layout {
      grid-area: 3 / 2 / 5 / 7;
    }
    &.grid-layout {
      grid-area: 1 / 3 / 2 / 8;
    }
  }
  &-scope-view {
    &.list-layout {
      grid-area: 5 / 2 / 6 / 7;
    }
    &.grid-layout {
      /* The grid layout required the scope height to be at least 450px to work properly and avoid overlaps */
      min-height: 450px;
      grid-area: 2 / 3 / 17 / 8;
    }
  }
  &-actions {
    &.list-layout {
      grid-area: 6 / 5 / 7 / 7;
    }
    &.grid-layout {
      grid-area: 16 / 1 / 17 / 3;
    }
  }
}

.remediation-project-selector-separator {
  position: absolute;
  transform: translateX(calc(-25px - 35px)) translateY(-50%);
  > * {
    z-index: 2;
    background-color: white;
  }
  &::before {
    z-index: 1;
    transform: translateX(35px);
    height: 60px;
    width: 25px;
    content: '';
    border: solid grey;
    border-width: 2px 0 2px 2px;
    border-radius: 15px 0px 0px 15px;
  }
}
</style>
