<script>
// @ts-check

// IMPORTANT NOTE: for now, it's only for super asset, not for server, web, user, ...
import { getRiskScoreColor, getRiskScoreLetter, roundScore } from '~/utils/risk.utils'
import { isSuperAsset } from '~/utils/asset.utils'

export default {
  props: {
    /**
     * @type {import('vue').PropOptions<(import('~/types/asset').BelongedAsset)>}
     */
    asset: {
      required: true,
      type: Object,
    },
  },
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
      if (isSuperAsset(this.asset.type))
        return this.compoundScore

      return this.inheritedScore
    },
    /**
     * @returns {"A" | "B" | "C" | "D" | "E" | "F"}
     */
    riskScoreLetter() {
      return getRiskScoreLetter(
        this.scoreToUse,
        this.hasVulnerability,
        this.isScanned || isSuperAsset(this.asset.type),
      )
    },
    /**
     * @returns {string}
     */
    riskScoreColor() {
      return getRiskScoreColor(
        this.scoreToUse,
        this.hasVulnerability,
        this.isScanned || isSuperAsset(this.asset.type),
      )
    },
  },
  methods: {
    /**
     * @param {"A" | "B" | "C" | "D" | "E" | "F"} letter
     * @returns {string}
     */
    getExtraLetterStyle(letter) {
      if (letter !== this.riskScoreLetter)
        return ''

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
    text-align: center;
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
