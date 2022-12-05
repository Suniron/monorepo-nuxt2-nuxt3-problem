<template>
  <v-container>
    <v-container class="divgraph d-flex justify-space-between mb-6">
      <v-card class="flex-shrink-1">
        <v-card-title>Select a compliance</v-card-title>
        <v-card-text>
          <v-select
            v-model="comp"
            :items="compliances"
            item-text="compliance"
            item-value="compliance"
            label="Compliance Framework"
            @change="fetchChapters"
          />
        </v-card-text>
      </v-card>
      <div v-if="compliance.length !== 0" class="graph">
        <SpiderGraph
          id="completion-graph"
          title="ISO Completion"
          :data="completionData"
          :export-file-name="exportCompletionFileName"
        />
      </div>
      <div v-if="compliance.length !== 0" class="graph">
        <SpiderGraph
          id="maturity-graph"
          title="ISO Maturity"
          :data="maturityData"
          :export-file-name="exportMaturityFileName"
        />
      </div>
    </v-container>

    <div id="spinner" v-if="isLoading"><loading-spinner /></div>
    <v-stepper
      class="mt-4"
      v-if="compliance.length != 0"
      v-model="step"
      vertical
    >
      <template v-for="(q, i) in Object.keys(compliance)">
        <v-stepper-step
          :key="'step-' + i"
          class="chapter"
          :complete="isCompleted(compliance[q])"
          :step="i + 1"
          @click="step = i + 1"
        >
          {{ compliance[q][0].chapter }}
          <small v-if="compliance[q][0].chapter_small">{{
            compliance[q][0].chapter_small
          }}</small>
        </v-stepper-step>
        <v-stepper-content :key="'step-content-' + i" :step="i + 1">
          <v-data-table
            :headers="headers"
            :items="compliance[q]"
            class="elevation-1"
            disable-pagination
            hide-default-footer
          >
            <template #[`item.title`]="{ item }">
              <p>
                <v-chip small>{{ item.section }}</v-chip> <b>{{ item.title }}</b
                >:<br />{{ item.description }}
              </p>
            </template>
            <template #[`item.response`]="{ item }">
              <v-select
                v-model="item.status"
                :items="item.response"
                item-text="text"
                item-value="value"
                dense
                @change="updateChange(item)"
              ></v-select>
            </template>
            <template #[`item.mitigation`]="{ item }">
              <v-textarea
                :disabled="item.status === 'Ok' || !item.status"
                v-model="item.mitigation"
                rows="3"
                @change="updateChange(item)"
              ></v-textarea>
            </template>
            <template #[`item.residual_risk`]="{ item }">
              <v-select
                :items="Object.keys(risks)"
                v-model="item.residual_risk"
                :disabled="item.status === 'Ok' || !item.status"
                @change="updateChange(item)"
              >
                <template #selection="{ item: residual_risk }">
                  <v-chip :color="risks[residual_risk]" small>
                    {{ residual_risk }}
                  </v-chip>
                </template>
              </v-select>
            </template>
            <template #[`item.risk`]="{ item }">
              <v-chip
                v-if="item.status"
                style="margin: 2px;"
                :color="risks[item.status]"
                small
                >{{ item.status }}</v-chip
              >
            </template>
            <template #[`item.docs`]="{ item }">
              <v-select
                :disabled="!item.status"
                :items="docs"
                v-model="item.docs"
                item-text="name"
                item-value="id"
                multiple
                chips
                deletable-chips
                @change="relationChanged(item)"
              />
            </template>
            <!-- <template #[`item.scenario`]="{ item }">
            <v-chip
              v-for="(s, j) in item.scenario"
              :key="'scen-' + i + '-' + j"
              style="margin: 2px;"
              small
            >
              {{ s }}</v-chip
            >
          </template> -->
          </v-data-table>
          <v-row justify="end" style="margin: 5px;">
            <v-col cols="12" xl="1" lg="2">
              <v-btn text @click="step = i">PREVIOUS</v-btn>
            </v-col>
            <v-col cols="12" xl="1" lg="2">
              <v-btn color="primary" @click="step = i + 2">NEXT</v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </template>
    </v-stepper>
  </v-container>
</template>

<script>
// @ts-check
import { fetchComplianceService } from '~/services/audit'
import {
  searchAssetsService,
  createAssetService,
  updateAssetService
} from '~/services/assets'
import { createRelationService } from '~/services/relations'
import SpiderGraph from '~/components/charts/spider-graph.vue'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'

export default {
  components: { SpiderGraph, LoadingSpinner },
  middleware: ['auth'],
  data() {
    return {
      headers: [
        { text: 'Question', value: 'title', width: '40%' },
        { text: 'Response', value: 'response', width: '200px' },
        { text: 'Risk', value: 'risk', width: '72px' },
        { text: 'Mitigation', value: 'mitigation' },
        { text: 'Residual Risk', value: 'residual_risk', width: '72px' },
        { text: 'Supportive Document', value: 'docs', width: '180px' }
      ],
      step: 1,
      risks: {
        Low: '#f0d802',
        Medium: '#ed9b0e',
        High: '#d92b2b',
        Critical: '#941e1e',
        Ok: '#00bfba'
      },
      comp: null,
      compliance: [],
      compliances: [],
      docs: [],
      section: [],
      residualRisk: [],
      response: [],
      isLoading: false,
      completionData: {
        x: {
          value: []
        },
        completion: {
          value: []
        }
      },
      maturityData: {
        x: {
          value: []
        },
        maturity: {
          value: []
        }
      }
    }
  },
  computed: {
    /**
     * @returns {string}
     */
    exportCompletionFileName() {
      return `Compliance completion ${
        this.comp
      } ${new Date().toLocaleDateString().replace(/\//g, '_')}.png`
    },
    /**
     * @returns {string}
     */
    exportMaturityFileName() {
      return `Compliance maturity ${
        this.comp
      } ${new Date().toLocaleDateString().replace(/\//g, '_')}.png`
    }
  },
  created() {
    this.$store.dispatch('changePageTitle', 'Audit')
    this.fetchCompliance()
  },
  methods: {
    async fetchCompliance() {
      const data = await fetchComplianceService(this.$axios)
      this.compliances = data.compliances
      const serviceParams = {}
      serviceParams.types = ['POLICY', 'PROCEDURE']
      // serviceParams.attribute = 'name'
      const { assets } = await searchAssetsService(this.$axios, serviceParams)
      this.docs = assets
    },
    async fetchRadarData(statistics = []) {
      if (!statistics.length) {
        const data = await fetchComplianceService(this.$axios, {
          compliance: this.comp
        })
        statistics = data.statistics
      }
      this.completionData.completion.value = []
      this.completionData.x.value = []
      this.maturityData.maturity.value = []
      this.maturityData.x.value = []
      for (const chapter of statistics) {
        /* Regex match for ISO 27001 chapters - use to create labels */
        const [title] = chapter.chapter_small.match(/[A-Z]\.\d{1,6}/gm)
        this.completionData.completion.value.push(chapter.completion)
        this.maturityData.maturity.value.push(chapter.maturity)
        this.completionData.x.value.push(title ?? chapter.chapter_small)
        this.maturityData.x.value.push(title ?? chapter.chapter_small)
      }
    },
    async fetchChapters() {
      this.isLoading = true
      const data = await fetchComplianceService(this.$axios, {
        compliance: this.comp
      })
      this.isLoading = false
      this.compliance = data.compliances
      this.fetchRadarData(data.statistics)
    },
    async updateChange(item) {
      if (item.status === 'Ok') item.residual_risk = 'Ok'
      if (item.asset_id) {
        await updateAssetService(this.$axios, item.asset_id, {
          assetData: item
        })
      } else {
        const name = item.compliance + ' / ' + item.chapter + ' / ' + item.title
        const type = 'COMPLIANCE'
        item.compliance_id = item.id
        const assetData = item
        item.asset_id = (
          await createAssetService(this.$axios, {
            name,
            type,
            assetData
          })
        ).id
      }
      this.fetchRadarData()
    },
    async relationChanged(item) {
      const params = {
        to_asset_id: item.asset_id,
        type: 'COMPLY_TO',
        from_asset_id: item.docs,
        replace: true
      }
      await createRelationService(this.$axios, params)
    },
    /**
     * @returns {boolean}
     */
    isCompleted(items) {
      const res = items.every((el) => el.status !== null)
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.chapter:hover {
  cursor: pointer;
}
.graph {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
#maturity-graph,
#completion-graph {
  width: 80%;
  height: 80%;
}
.divgraph {
  gap: 20px;
}
#spinner {
  text-align: center;
}
</style>
