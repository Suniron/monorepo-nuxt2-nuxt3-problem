<script>
// @ts-check
import RiskScoreExplanationModal from './RiskScoreExplanationModal.vue'
import { getAssetsRisk } from '~/services/assets'
import { riskScoreColor, riskScoreLetter, roundScore } from '~/utils/risk.utils'
import { isSuperAsset } from '~/utils/asset.utils'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'

export default {
  components: {
    RiskScoreExplanationModal,
    LoadingSpinner
  },
  name: 'AssetRiskScore',
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    dialogOpen: false,
    loading: true,
    hasVuln: false,
    scanned: false,
    scores: {
      inherent: null,
      compound: null,
      inherited: null,
    },
    timeout: 5000,
    snackbar: false,
    snackbarText: 'A problem has occurred that makes the service temporarily unavailable. Please try again later',
  }),
  computed: {
    /**
     * @returns {number}
     */
    assetId() {
      return this.asset.id
    },

    /**
     * @returns {{letter: String, color: String}}
     */
    getGlobalRiskScore() {
      return {
        color: riskScoreColor(
          this.scoreToUse,
          this.hasVuln,
          this.scanned || isSuperAsset(this.asset.type),
        ),
        letter: riskScoreLetter(
          this.scoreToUse,
          this.hasVuln,
          this.scanned || isSuperAsset(this.asset.type),
        ),
      }
    },

    /**
     * @returns {{
     *  inherent: string | number,
     *  inherited: string | number,
     *  compound: string | number
     * }}
     */
    getScoresToDisplay() {
      return {
        compound:
          this.scores.compoundScore === null
            ? 'N/A'
            : roundScore(this.scores.compoundScore),
        inherent:
          this.scores.inherentScore === null
            ? 'N/A'
            : roundScore(this.scores.inherentScore),
        inherited:
          this.scores.inheritedScore === null
            ? 'N/A'
            : roundScore(this.scores.inheritedScore),
      }
    },

    /**
     * Get the score to use depending on the asset type
     *
     * @returns {number}
     */
    scoreToUse() {
      if (isSuperAsset(this.asset.type))
        return this.scores.compoundScore

      return this.scores.inheritedScore
    },

    /**
     * @returns {boolean}
     */
    superAsset() {
      return isSuperAsset(this.asset.type)
    },
  },
  mounted() {
    this.fetchScores()
  },
  watch: {
    assetId() {
      this.fetchScores()
    }
  },
  methods: {
    async fetchScores() {
      this.loading = true
      try {
        const { data } = await getAssetsRisk(this.$axios, this.assetId)
        this.scores.inherentScore = data.scores.inherentScore
        this.scores.inheritedScore = data.scores.inheritedScore
        this.scores.compoundScore = data.scores.compoundScore
        this.scanned = data.lastScanDate !== null

        // If the inherent score is at 0, it means there only are remediated vulns.
        // A non-scanned & no-vuln asset has an inherent risk score of 10
        this.hasVuln = data.scores.inherentScore === 0 || data.hasVulnerability
      }
      finally {
        this.loading = false
        if (this.getScoresToDisplay.compound === -1 || this.getScoresToDisplay.inherent === -1 || this.getScoresToDisplay.inherited === -1)
          this.snackbar = true
      }
    },
  },
}
</script>

<template>
  <LoadingSpinner v-if="loading" class="risk-score-spinner" />
  <div v-else class="d-flex flex-column" style="width: fit-content">
    <v-dialog v-model="dialogOpen" width="700">
      <template #activator="{ on }">
        <div
          class="align-self-center risk-score-grade"
          style="cursor: pointer"
          :style="{ 'background-color': getGlobalRiskScore.color }"
          v-on="on"
        >
          <p class="score-letter">
            {{ getGlobalRiskScore.letter }}
          </p>
        </div>
      </template>
      <RiskScoreExplanationModal :is-super-asset="superAsset" />
    </v-dialog>
    <div v-if="superAsset" style="display: flex">
      <p>
        <strong>Compound Risk Score: </strong>
        <span :title="scores.compound">{{ getScoresToDisplay.compound }}</span>
      </p>
    </div>
    <template v-else>
      <div style="display: flex">
        <p>
          <strong>Inherent Risk Score: </strong>
          <span :title="scores.inherent">{{
            getScoresToDisplay.inherent
          }}</span>
        </p>
      </div>
      <div style="display: flex">
        <p>
          <strong>Inherited Risk Score: </strong>
          <span :title="scores.inherited">{{
            getScoresToDisplay.inherited
          }}</span>
        </p>
      </div>
      <v-snackbar v-model="snackbar" :timeout="timeout" color="red accent-2">
        {{ snackbarText }}
        <template #action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </div>
</template>

<style lang="scss">
.risk-score-grade {
  margin-bottom: 10px;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  text-align: center;
  line-height: 80px;
  color: white;
  font-size: 60px;
  box-shadow: inset 0 0 black, 0 8px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: inset 0 8px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease-in-out;
    // filter: brightness(110%);
  }

  &:active {
    box-shadow: inset 0 8px 8px rgba(0, 0, 0, 0.4);
    transition: box-shadow 0.2s ease-in-out;
    // filter: brightness(110%);
  }
}
.score-letter {
  text-shadow: inset 0 0 black, 0 8px 8px rgba(0, 0, 0, 0.4);
}

.risk-score-spinner {
  margin-top: 40px;
  margin-left: 70px;
}
</style>
