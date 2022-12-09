<script>
import RiskScoreExplanationModal from '../assets/details/RiskScoreExplanationModal.vue'
import { getCompanyRisk } from '~/services/companies'
import { globalRiskScoreDisplays } from '~/utils/risk.utils'

export default {
  components: { RiskScoreExplanationModal },
  name: 'MyCompanyScore',
  data: () => ({
    companyScore: null,
    dialogOpen: false,
    gradingElementDimensions: 100
  }),
  computed: {
    /**
     * @returns {{letter: String, color: String, subtitle: String}}
     */
    getGlobalRiskScore() {
      return {
        color: globalRiskScoreDisplays(this.companyScore).color,
        letter: globalRiskScoreDisplays(this.companyScore).letter,
        subtitle: globalRiskScoreDisplays(this.companyScore).subtitle,
      }
    },
    fontSize() {
      return `${(this.gradingElementDimensions * 0.7) /
        this.getGlobalRiskScore.letter.length}px`
    },
    squareSize() {
      return `calc(${this.gradingElementDimensions}px - 1.5em)`
    }
  },
  created() {
    return this.getCompanyRiskScore()
  },
  methods: {
    async getCompanyRiskScore() {
      const companyRisk = await getCompanyRisk(this.$axios)
      this.companyScore = companyRisk.globalScore
    },
    resize() {
      const title = this.$refs.companyScoreWidgetTitle
      const el = this.$el
      if (!el || !title) {
        this.gradingElementDimensions = 100
        return
      }
      const width = el.clientWidth
      const height = el.clientHeight
      const titleHeight = title.clientHeight
      this.gradingElementDimensions =
        Math.min(width, height - titleHeight) * 0.9
    }
  },
  mounted() {
    this.resize()

    new ResizeObserver(this.resize.bind(this)).observe(this.$el)
  }
}
</script>

<template>
  <v-card class="d-flex flex-column">
    <v-card-title ref="companyScoreWidgetTitle">
      My Company Score<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>

    <div
      class="align-self-center d-flex flex-column justify-center align-center flex-grow-1"
    >
      <v-dialog v-model="dialogOpen" width="700">
        <template #activator="{ on }">
          <div
            class="company-risk-score-grade d-flex justify-center align-center"
            style="cursor: pointer"
            :style="{
              'background-color': getGlobalRiskScore.color,
              'width': squareSize,
              'height': squareSize,
            }"
            v-on="on"
          >
            <p class="ma-0" :style="{ fontSize }">
              {{ getGlobalRiskScore.letter }}
            </p>
          </div>
        </template>
        <RiskScoreExplanationModal global-risk-score />
      </v-dialog>

      <p class="text-center">
        <strong>{{ getGlobalRiskScore.subtitle }}</strong>
      </p>
    </div>
  </v-card>
</template>

<style lang="scss">
.company-risk-score-grade {
  margin-bottom: 10px;
  border-radius: 8px;
  color: white;
  box-shadow: inset 0 0 black, 0 8px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;
}
.risk-score-spinner {
  margin-top: 40px;
  margin-left: 70px;
}
</style>
