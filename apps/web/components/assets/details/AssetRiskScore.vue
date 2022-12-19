<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useContext } from '@nuxtjs/composition-api'
import RiskScoreExplanationModal from './RiskScoreExplanationModal.vue'
import { getAssetsRisk } from '~/services/assets'
import { riskScoreColor, riskScoreLetter, roundScore } from '~/utils/risk.utils'
import { isSuperAsset } from '~/utils/asset.utils'
import LoadingSpinner from '~/components/utils/LoadingSpinner.vue'

const { asset } = defineProps({
  asset: {
    required: true,
    type: Object,
  },
})

const axios = useContext().$axios

const dialogOpen = ref(false)
const loading = ref(true)
const hasVuln = ref(false)
const scanned = ref(false)
const scores = ref<{
  compound: null | number
  inherent: null | number
  inherited: null | number
}>({
  compound: null,
  inherent: null,
  inherited: null,
})
const timeout = ref(5000)
const snackbar = ref(false)
const snackbarText = ref('A problem has occurred that makes the service temporarily unavailable. Please try again later')

const scoreToUse = computed (
  () =>
    isSuperAsset(asset.type)
      ? scores.value.compound
      : scores.value.inherited,
)
const assetId = computed<number>(() => asset.id)
const getGlobalRiskScore = computed(() => {
  if (scoreToUse.value === null) {
    return {
      color: 'black',
      letter: 'N/A',
    }
  }

  return {
    color: riskScoreColor(
      scoreToUse.value,
      hasVuln.value,
      scanned.value || isSuperAsset(asset.type),
    ),
    letter: riskScoreLetter(
      scoreToUse.value,
      hasVuln.value,
      scanned.value || isSuperAsset(asset.type),
    ),
  }
},
)
const getScoresToDisplay = computed(() => ({
  compound:
          scores.value.compound === null
            ? 'N/A'
            : roundScore(scores.value.compound),
  inherent:
          scores.value.inherent === null
            ? 'N/A'
            : roundScore(scores.value.inherent),
  inherited:
          scores.value.inherited === null
            ? 'N/A'
            : roundScore(scores.value.inherited),
}))
const superAsset = computed(() => isSuperAsset(asset.type))

const fetchScores = async () => {
  loading.value = true
  try {
    const { data } = await getAssetsRisk(axios, assetId.value)
    scores.value.inherent = data.scores.inherentScore
    scores.value.inherited = data.scores.inheritedScore
    scores.value.compound = data.scores.compoundScore
    scanned.value = data.lastScanDate !== null

    // If the inherent score is at 0, it means there only are remediated vulns.
    // A non-scanned & no-vuln asset has an inherent risk score of 10
    hasVuln.value = data.scores.inherentScore === 0 || data.hasVulnerability
  }
  finally {
    loading.value = false
    if (getScoresToDisplay.value.compound === -1 || getScoresToDisplay.value.inherent === -1 || getScoresToDisplay.value.inherited === -1)
      snackbar.value = true
  }
}

onMounted(() => fetchScores())
watch(
  asset, async () => {
    await fetchScores()
  },
)
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
        <span>{{ getScoresToDisplay.compound }}</span>
      </p>
    </div>
    <template v-else>
      <div style="display: flex">
        <p>
          <strong>Inherent Risk Score: </strong>
          <span>{{
            getScoresToDisplay.inherent
          }}</span>
        </p>
      </div>
      <div style="display: flex">
        <p>
          <strong>Inherited Risk Score: </strong>
          <span>{{
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
