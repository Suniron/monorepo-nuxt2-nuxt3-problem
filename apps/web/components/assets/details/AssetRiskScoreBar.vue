<script>
// @ts-check

// IMPORTANT NOTE: for now, it's only for super asset, not for server, web, user, ...
import { riskScoreColor, riskScoreLetter, roundScore } from '~/utils/risk.utils'

export default {
  computed: {
    /**
     * @returns {number}
     */
    compoundScore() {
      return roundScore(this.asset.risk.scores.compoundScore)
    },
    /**
     * @returns {number}
     */
    inherentScore() {
      return roundScore(this.asset.risk.scores.inherentScore)
    },
    /**
     * @returns {number}
     */
    inheritedScore() {
      return roundScore(this.asset.risk.scores.inheritedScore)
    },
    /**
     * @returns {boolean}
     */
    isScanned() {
      return this.asset.risk.lastScanDate !== null
    },
    /**
     * @returns {boolean}
     */
    hasVulnerability() {
      return this.asset.risk?.hasVulnerability
    },
    /**
     * Get the score to use depending on the asset type
     *
     * @returns {number}
     */
    scoreToUse() {
      if (this.isSuperAsset) {
        return this.compoundScore
      }

      return this.inheritedScore
    },
    /**
     * TODO: Check with a list of super assets instead the reverse
     *
     * @returns {boolean}
     */
    isSuperAsset() {
      return !['USER', 'SERVER', 'WEB'].includes(this.asset.type)
    },
    /**
     * @returns {"A" | "B" | "C" | "D" | "E" | "F"}
     */
    riskScoreLetter() {
      return riskScoreLetter(
        this.scoreToUse,
        this.hasVulnerability,
        this.isScanned || this.isSuperAsset
      )
    },
    /**
     * @returns {string}
     */
    riskScoreColor() {
      return riskScoreColor(
        this.scoreToUse,
        this.hasVulnerability,
        this.isScanned || this.isSuperAsset
      )
    }
  },
  props: {
    /**
     * @type {import('vue').PropOptions<(import('~/types/asset').BelongedAsset)>}
     */
    asset: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * @param {"A" | "B" | "C" | "D" | "E" | "F"} letter
     * @returns {string}
     */
    getExtraLetterStyle(letter) {
      if (letter !== this.riskScoreLetter)
        return

      return `background-color: ${this.riskScoreColor}`
    },
  },
}
</script>

<template>
  <div class="risk-score-bar d-flex justify-space-between px-1">
    <p :style="getExtraLetterStyle('A')">
      A
    </p>
    <p :style="getExtraLetterStyle('B')">
      B
    </p>
    <p :style="getExtraLetterStyle('C')">
      C
    </p>
    <p :style="getExtraLetterStyle('D')">
      D
    </p>
    <p :style="getExtraLetterStyle('E')">
      E
    </p>
    <p :style="getExtraLetterStyle('F')">
      F
    </p>
  </div>
</template>

<style lang="scss" scoped>
.risk-score-bar {
  p {
    background-color: #d9d9d9;
    color: white;
    width: 100%;
    margin-bottom: 0px !important;
  }

  :first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  :last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>
