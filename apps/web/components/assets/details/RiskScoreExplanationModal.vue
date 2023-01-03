<script>
import {
  getRiskScoreColor,
  getRiskScoreLetter,
  globalRiskScoreDisplays,
} from '~/utils/risk.utils'
export default {
  props: {
    isSuperAsset: {
      type: Boolean,
      default: false
    },
    globalRiskScore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      riskScoreColor: getRiskScoreColor,
      riskScoreLetter: getRiskScoreLetter,
      globalRiskScoreDisplays,
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>What is this ?</v-card-title>
    <v-card-text>
      <v-alert border="left" colored-border type="info" elevation="2">
        <template v-if="globalRiskScore">
          <p>
            The letter is a grade from
            <v-chip
              label
              :color="globalRiskScoreDisplays(0).color"
              class="grade-scale-extrema"
            >
              {{ globalRiskScoreDisplays(0).letter }}
            </v-chip>
            (best) to
            <v-chip
              label
              :color="globalRiskScoreDisplays(10).color"
              class="grade-scale-extrema"
            >
              {{ globalRiskScoreDisplays(10).letter }}
            </v-chip>
            (worst) representing the average risk score of your business
            missions. The
            <v-chip
              label
              :color="globalRiskScoreDisplays(null).color"
              class="grade-scale-extrema"
            >
              {{ globalRiskScoreDisplays(null).letter }}
            </v-chip>
            grading means that there is no Business Missions risk score.
          </p>
        </template>
        <template v-else>
          <p>
            The letter is a grade from
            <v-chip
              label
              :color="riskScoreColor(0, true)"
              class="grade-scale-extrema"
            >
              {{ riskScoreLetter(0, true) }}
            </v-chip>
            (best) to
            <v-chip
              label
              :color="riskScoreColor(10, true)"
              class="grade-scale-extrema"
            >
              {{ riskScoreLetter(10, true) }}
            </v-chip>
            (worst) representing the
            {{ isSuperAsset ? 'compound' : 'inherited' }} risk. The
            <v-chip
              label
              :color="riskScoreColor(null)"
              class="grade-scale-extrema"
            >
              {{ riskScoreLetter(null) }}
            </v-chip>
            grading means that there is no risk score available.
          </p>
          <p>
            The following values are calculated based on the severity of the
            vulnerabilities and its neighbors'.
          </p>
          <ul>
            <li v-if="isSuperAsset">
              The <strong>compound risk</strong> score is a score calculated for
              <abbr title="Assets that can &quot;contain&quot; other assets">
                super assets</abbr>
              based on its related technical assets' risk scores.
            </li>
            <template v-else>
              <li>
                The <strong>inherent risk</strong> score is calculated based on
                the vulnerability with the highest severity.
              </li>
              <li>
                The <strong>inherited risk</strong> score is a score calculated
                for technical assets based on its neighbors' risk score.
              </li>
            </template>
          </ul>
        </template>
        <p>The scores are updated every 5 minutes</p>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style>
.grade-scale-extrema {
  font-weight: bold;
  color: white !important;
}
</style>
