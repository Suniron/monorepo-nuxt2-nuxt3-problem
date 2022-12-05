<template>
  <v-card>
    <v-card-title class="pb-0">
      Compliance
      <!-- COMPLIANCE SELECTOR-->
      <v-select
        v-if="compliances.length"
        v-model="selectedCompliance"
        :items="compliances"
        class="pl-4"
      ></v-select>
      <v-spacer />
      <v-icon @click="$emit('close')">mdi-close</v-icon></v-card-title
    >

    <v-card-text class="d-flex">
      <LoadingSpinner v-if="isLoading" />

      <v-alert v-else-if="isError" type="warning">
        An error occurred during loading
      </v-alert>

      <template v-else-if="selectedCompliance">
        <div class="graph">
          <SpiderGraph
            id="completion-graph"
            :data="completionData"
            :export-file-name="exportCompletionFileName"
            title="ISO Completion"
          />
        </div>
        <div class="graph">
          <SpiderGraph
            id="maturity-graph"
            :data="maturityData"
            :export-file-name="exportMaturityFileName"
            title="ISO Maturity"
          />
        </div>
      </template>

      <v-alert v-else type="info">
        Select a compliance framework to show graphs
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
// @ts-check
import { fetchComplianceService } from '~/services/audit'
import LoadingSpinner from '@/components/utils/LoadingSpinner.vue'
import SpiderGraph from '@/components/charts/spider-graph.vue'

export default {
  components: {
    LoadingSpinner,
    SpiderGraph
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      /**
       * @type string[]
       */
      compliances: [],
      /**
       * @type string
       */
      selectedCompliance: null,
      /**
       * Completion spider graph data
       */
      completionData: {
        x: {
          value: []
        },
        completion: {
          value: []
        }
      },
      /**
       * Maturity spider graph data
       */
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
        this.selectedCompliance
      } ${new Date().toLocaleDateString().replace(/\//g, '_')}.png`
    },
    /**
     * @returns {string}
     */
    exportMaturityFileName() {
      return `Compliance maturity ${
        this.selectedCompliance
      } ${new Date().toLocaleDateString().replace(/\//g, '_')}.png`
    }
  },
  watch: {
    /**
     * Refresh data when selected compliance changes
     */
    selectedCompliance() {
      this.fetchComplianceGraphsData()
    }
  },
  mounted() {
    this.fetchCompliances()
  },
  methods: {
    /**
     * Fetch all different compliance frameworks
     */
    async fetchCompliances() {
      this.isLoading = true
      try {
        const data = await fetchComplianceService(this.$axios)

        this.compliances = data.compliances.map((c) => c.compliance)

        // Auto select the first compliance framework
        if (this.compliances.length) {
          this.selectedCompliance = this.compliances[0]
        }
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Fetch all statistics about the selected compliance framework to update the graphs
     */
    async fetchComplianceGraphsData() {
      if (!this.selectedCompliance) {
        return
      }

      try {
        this.isLoading = true
        const { statistics } = await fetchComplianceService(this.$axios, {
          compliance: this.selectedCompliance
        })

        for (const chapter of statistics) {
          /* Regex match for ISO 27001 chapters - use to create labels */
          const [title] = chapter.chapter_small.match(/[A-Z]\.\d{1,6}/gm)
          this.completionData.completion.value.push(chapter.completion)
          this.maturityData.maturity.value.push(chapter.maturity)
          this.completionData.x.value.push(title ?? chapter.chapter_small)
          this.maturityData.x.value.push(title ?? chapter.chapter_small)
        }
      } catch (error) {
        console.log(error)
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.graph {
  height: 250px;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#maturity-graph,
#completion-graph {
  height: 80%;
  width: 80%;
}
</style>
