<script>
// @ts-check
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

import { mapActions, mapState } from 'vuex'
import RemediationProjectScope from '~/components/remediation-project/RemediationProjectScope.vue'
import GroupedRemediationSelector from '~/components/remediation-project/selectors/GroupedRemediationsSelector.vue'
import AssetVulnerabilitySelector from '~/components/remediation-project/selectors/AssetVulnerabilitySelector.vue'
import {
  searchGroupedRemediationsService,
  updateRemediationProjectScopeService,
} from '~/services/remediation-projects'
import { searchAssetsBelonging } from '~/services/assets'
import { searchVulnerabilitiesWithTheirAssetsService } from '~/services/vulnerabilities'

export default {
  components: {
    AssetVulnerabilitySelector,
    GroupedRemediationSelector,
    RemediationProjectScope,
  },
  computed: {
    ...mapState({
      /**
       * @returns {import('~/store/remediationProject').SpecificRemediationProject}
       */
      projectDetailsInfo: state =>
        state.remediationProject.projectDetails?.info,
      /**
       * @returns {import('~/store/remediationProject').RemediationProjectScopeItem[]}
       */
      projectDetailsScope: state =>
        state.remediationProject.projectDetails?.scope ?? [],
    }),
  },
  async created() {
    const { data } = await searchGroupedRemediationsService(this.$axios)
    this.groupedRemediations = data.sort(
      (rem1, rem2) =>
        rem2.count_asset_vuln_unmanaged - rem1.count_asset_vuln_unmanaged,
    )

    const { data: assetsBelongings } = await searchAssetsBelonging(this.$axios)
    this.assetsBelongings = assetsBelongings.assets

    const {
      vulnerabilities,
    } = await searchVulnerabilitiesWithTheirAssetsService(this.$axios)

    this.vulnerabilities = vulnerabilities
  },
  data() {
    return {

      /**
       * @type {import('~/types/asset').AssetWithRelations[]}
       */
      assetsBelongings: [],

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
       * @type {import('~/types/remediationProject').RemediationProjectScopeItem[]}
       */
      projectScope: [],

      /**
       * @type {import('~/types/remediationProject').ScopeType[]}
       */
      scope: [],

      scopeFilter: '',

      scopeGroup: null,

      scopeGroups: [
        { text: 'Source', value: 'source.name' },
        { text: 'Asset', value: 'asset.name' },
        { text: 'Vulnerability', value: 'vulnerability.name' },
      ],

      selectedScopeElements: [],
      /**
       * @type {import('~/types/vulnerability').VulnerabilityWithAssets[]}
       */
      vulnerabilities: [],
    }
  },
  methods: {
    ...mapActions('remediationProject', [
      'fetchRemediationProjectDetailsScope',
    ]),

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
          scope => scope.vulnerability.vastId === vulnerability.vastId,
        )
        if (isVastIdAlreadyInScope)
          return

        const assetVulnerability = this.vulnerabilities
          .find(v => v.id === vulnerability.id)
          .affectedAssets.find(a => a.vastId === vulnerability.vastId)
        this.scope.push({
          asset: {
            id: assetVulnerability.id,
            name: assetVulnerability.name,
          },
          source: {
            id: asset.id,
            name: asset.name,
            type: 'SUPERASSET',
          },
          vulnerability: {
            id: vulnerability.id,
            name: vulnerability.name,
            vastId: vulnerability.vastId,
          },
        })
      })
    },

    /**
     * @param {import('~/components/remediation-project/selectors/GroupedRemediationsSelector.vue').GroupedRemediation} cluster
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
          vulnerability => vulnerability.clusterId === cluster.clusterId,
        )
        .reduce((acc, vulnerability) => {
          return acc.concat(
            vulnerability.affectedAssets
              .filter(
                affectedAsset =>
                  affectedAsset.projects.length === 0
                  && affectedAsset.status !== 'remediated',
              )
              .map(asset => ({
                ...asset,
                vulnId: vulnerability.id,
                vulnName: vulnerability.name,
              })),
          )
        }, [])

      affectedAssetsOfCluster.forEach((affectedAsset) => {
        // Checking if vastId is already in the scope
        const isVastIdAlreadyInScope = this.scope.some(
          scope => scope.vulnerability.vastId === affectedAsset.vastId,
        )
        if (isVastIdAlreadyInScope)
          return

        this.scope.push({
          asset: {
            id: affectedAsset.id,
            name: affectedAsset.name,
          },
          source: {
            id: affectedAsset.vulnId,
            name: cluster.remediation,
            type: 'CLUSTER',
          },
          vulnerability: {
            id: affectedAsset.vulnId,
            name: affectedAsset.vulnName,
            vastId: affectedAsset.vastId,
          },
        })
      })
    },

    clearScope() {
      if (this.selectedScopeElements.length) {
        this.selectedScopeElements.forEach((element) => {
          this.scope.splice(this.scope.indexOf(element), 1)
        })
        this.selectedScopeElements.splice(0)
      }
      else {
        this.scope.splice(0)
      }
    },

    /**
     * @param {import('~/types/remediationProject').RemediationProjectScopeItem[]} scopeItems
     */
    initScope(scopeItems) {
      // Adapt scope items in store to push in datatable
      /**
       * @type {import('~/types/remediationProject').ScopeType[]}
       */
      const scopeToPush = scopeItems.map(scopeItem => ({
        asset: {
          id: scopeItem.asset_id,
          name: scopeItem.asset_name,
        },
        source: {
          id: 0,
          name: 'Project',
          type: 'INITIAL',
        },
        vulnerability: {
          id: scopeItem.vulnerability_id,
          name: scopeItem.vulnerability_name,
          vastId: scopeItem.vulnerability_asset_id,
        },
      }))

      // Replace datatable
      this.scope = scopeToPush
    },

    // = PROJECT DATAS =
    async saveProjectModifications() {
      if (!this.projectDetailsInfo?.project_id)
        return

      try {
        // Update all scope:
        await updateRemediationProjectScopeService(
          this.$axios,
          this.projectDetailsInfo.project_id,
          {
            project_scope: this.scope.map(s => s.vulnerability.vastId),
          },
        )
        // Refresh scope in vuex store:
        await this.fetchRemediationProjectDetailsScope(
          this.projectDetailsInfo.project_id,
        )
      }
      catch (error) {
        // TODO: handle request error
      }
    },
  },

  watch: {
    /**
     * Update/reset form values on each state change (about remediation project infos)
     */
    projectDetailsScope: {

      deep: true,
      /**
       * @param {import('~/types/remediationProject').RemediationProjectScopeItem[]} newScope
       */
      handler(newScopeItems) {
        this.initScope(newScopeItems)
      },
      immediate: true,
    },
  },
}
</script>

<template>
  <v-row justify="center">
    <v-col cols="10">
      <v-card class="pb-1">
        <v-card-title> Select project scope </v-card-title>

        <v-card-text class="pb-0">
          <!-- PROJECT SCOPE -->
          <div class="pl-10">
            <GroupedRemediationSelector
              :grouped-remediations="groupedRemediations"
              @add-remediation-cluster="addRemediationCluster"
            />
            <span class="p-relative"><span
              class="
                  remediation-project-selector-separator
                  mt-2
                  d-flex
                  align-center
                "
            ><span>OR</span></span></span>
            <AssetVulnerabilitySelector
              class="mt-4"
              :assets-belongings="assetsBelongings"
              :vulnerabilities="vulnerabilities"
              @add-asset-vulnerabilities="addAssetVulnerabilities"
            />
          </div>

          <v-card-title>Preview project scope</v-card-title>
          <v-row>
            <v-col>
              <v-text-field
                v-model="scopeFilter"
                label="Filter"
                clearable
                class="remediation-project-edition-form-filter shrink"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="scopeGroup"
                :items="scopeGroups"
                item-text="text"
                item-value="value"
                clearable
                class="shrink"
                label="Group by"
                placeholder="Group by"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                  closeOnClick: true,
                }"
              />
            </v-col>
          </v-row>

          <v-btn
            v-if="selectedScopeElements.length"
            class="ma-4"
            @click="clearScope"
          >
            Remove {{ selectedScopeElements.length }} element{{
              selectedScopeElements.length > 1 ? 's' : ''
            }}
          </v-btn>
          <v-btn v-else class="ma-4" @click="clearScope">
            Clear project scope
          </v-btn>

          <RemediationProjectScope
            v-model="selectedScopeElements"
            class="h-100"
            :filter="scopeFilter"
            :selected-group="scopeGroup"
            :scope="scope"
          />
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="saveProjectModifications">
            Save modifications
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
