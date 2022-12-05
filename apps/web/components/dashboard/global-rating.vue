<template>
  <v-card class="d-flex flex-column">
    <v-card-title ref="companyScoreWidgetTitle"
      >My Company Score<v-spacer></v-spacer
      ><v-icon @click="$emit('close')">mdi-close</v-icon></v-card-title
    >

    <div
      class="align-self-center d-flex flex-column justify-center align-center flex-grow-1"
    >
      <v-dialog v-model="dialogOpen" width="700">
        <template #activator="{ on }">
          <div
            v-on="on"
            class="company-risk-score-grade d-flex justify-center align-center"
            style="cursor: pointer"
            :style="{
              'background-color': getGlobalRiskScore.color,
              width: squareSize,
              height: squareSize
            }"
          >
            <p class="ma-0" :style="{ fontSize: fontSize }">
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

<script>
import RiskScoreExplanationModal from '../assets/details/RiskScoreExplanationModal.vue'
import { getCompanyRisk } from '~/services/companies'
import { globalRiskScoreDisplays } from '~/utils/risk.utils'

export default {
  name: 'MyCompanyScore',
  components: { RiskScoreExplanationModal },
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
        letter: globalRiskScoreDisplays(this.companyScore).letter,
        color: globalRiskScoreDisplays(this.companyScore).color,
        subtitle: globalRiskScoreDisplays(this.companyScore).subtitle
      }
    },
    squareSize() {
      return `calc(${this.gradingElementDimensions}px - 1.5em)`
    },
    fontSize() {
      return `${(this.gradingElementDimensions * 0.7) /
        this.getGlobalRiskScore.letter.length}px`
    }
  },
  created() {
    return this.getCompanyRiskScore()
  },
  mounted() {
    this.resize()

    new ResizeObserver(this.resize.bind(this)).observe(this.$el)
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
  }
}
</script>

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
