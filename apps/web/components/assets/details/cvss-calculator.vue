<template>
  <v-container class="align-self">
    <v-row justify="end">
      <v-col cols="12" lg="2">
        <v-card height="80" width="95" :color="color"
          ><v-card-title class="justify-center">{{ form.score }}</v-card-title
          ><v-card-subtitle class="text-center">
            ({{ severity }})</v-card-subtitle
          ></v-card
        >
      </v-col>
    </v-row>
    <div class="d-flex flex-wrap cvss-parameters">
      <div>
        <label>Attack Vector (AV) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: AV.N }"
            dense
            small
            @click.stop="changeCode('AV', 'N')"
            >Network (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: AV.A }"
            dense
            small
            @click.stop="changeCode('AV', 'A')"
            >Adjacent (A)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: AV.L }"
            dense
            small
            @click.stop="changeCode('AV', 'L')"
            >Local (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: AV.P }"
            dense
            small
            @click.stop="changeCode('AV', 'P')"
            >Physical (P)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Scope (S) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: S.U }"
            dense
            small
            @click.stop="changeCode('S', 'U')"
            >Unchanged (U)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: S.C }"
            dense
            small
            @click.stop="changeCode('S', 'C')"
            >Changed (C)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Attack Complexity (AC) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: AC.L }"
            dense
            small
            @click.stop="changeCode('AC', 'L')"
            >Low (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: AC.H }"
            dense
            small
            @click.stop="changeCode('AC', 'H')"
            >High (H)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Confidentiality (C) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: C.N }"
            dense
            small
            @click.stop="changeCode('C', 'N')"
            >None (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: C.L }"
            dense
            small
            @click.stop="changeCode('C', 'L')"
            >Low (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: C.H }"
            dense
            small
            @click.stop="changeCode('C', 'H')"
            >High (H)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Privileges Required (PR) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: PR.N }"
            dense
            small
            @click.stop="changeCode('PR', 'N')"
            >None (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: PR.L }"
            dense
            small
            @click.stop="changeCode('PR', 'L')"
            >Low (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: PR.H }"
            dense
            small
            @click.stop="changeCode('PR', 'H')"
            >High (H)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Integrity (I) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: I.N }"
            dense
            small
            @click.stop="changeCode('I', 'N')"
            >None (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: I.L }"
            dense
            small
            @click.stop="changeCode('I', 'L')"
            >Low (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: I.H }"
            dense
            small
            @click.stop="changeCode('I', 'H')"
            >High (H)</v-btn
          >
        </div>
      </div>
      <div>
        <label>User Interaction (UI) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: UI.N }"
            dense
            small
            @click.stop="changeCode('UI', 'N')"
            >None (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: UI.R }"
            dense
            small
            @click.stop="changeCode('UI', 'R')"
            >Required (R)</v-btn
          >
        </div>
      </div>
      <div>
        <label>Availibility (A) *</label>
        <div>
          <v-btn
            class="mr-1"
            :class="{ primary: A.N }"
            dense
            small
            @click.stop="changeCode('A', 'N')"
            >None (N)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: A.L }"
            dense
            small
            @click.stop="changeCode('A', 'L')"
            >Low (L)</v-btn
          >
          <v-btn
            class="mr-1"
            :class="{ primary: A.H }"
            dense
            small
            @click.stop="changeCode('A', 'H')"
            >High (H)</v-btn
          >
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
export default {
  props: {
    alreadyHasInformations: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data() {
    return {
      ex4: false,
      form: {
        score: '0.0',
        code: '',
        version: 3.1
      },
      cvss: { AV: '', AC: '', PR: '', UI: '', S: '', C: '', I: '', A: '' },
      score: '0.0',
      severity: 'Severity',
      color: 'grey',
      AV: {
        N: false,
        A: false,
        L: false,
        P: false
      },
      S: {
        U: false,
        C: false
      },
      AC: {
        L: false,
        H: false
      },
      C: {
        N: false,
        L: false,
        H: false
      },
      PR: {
        N: false,
        L: false,
        H: false
      },
      I: {
        N: false,
        L: false,
        H: false
      },
      UI: {
        N: false,
        R: false
      },
      A: {
        N: false,
        L: false,
        H: false
      },
      weight: {
        AV: {
          N: 0.85,
          A: 0.62,
          L: 0.55,
          P: 0.2
        },
        AC: {
          H: 0.44,
          L: 0.77
        },
        PR: {
          U: {
            N: 0.85,
            L: 0.62,
            H: 0.27
          },
          C: {
            N: 0.85,
            L: 0.68,
            H: 0.5
          }
        },
        UI: {
          N: 0.85,
          R: 0.62
        },
        S: {
          U: 6.42,
          C: 7.52
        },
        CIA: {
          N: 0.0,
          L: 0.22,
          H: 0.56
        }
      },
      severityRatings: [
        {
          name: 'None',
          bottom: 0,
          top: 0,
          color: '#9e9e9e'
        },
        {
          name: 'Low',
          bottom: 0.1,
          top: 3.9,
          color: '#f0d802'
        },
        {
          name: 'Medium',
          bottom: 4.0,
          top: 6.9,
          color: '#ed9b0e'
        },
        {
          name: 'High',
          bottom: 7.0,
          top: 8.9,
          color: '#d92b2b'
        },
        {
          name: 'Critical',
          bottom: 9.0,
          top: 10.0,
          color: '#941e1e'
        }
      ]
    }
  },
  created() {
    const tableau = []
    const tableau2 = []
    if (this.alreadyHasInformations && this.alreadyHasInformations.cvss_code) {
      this.form.score = this.alreadyHasInformations.cvss_score
      const elemWeNeed = this.alreadyHasInformations.cvss_code.split('/')
      for (const elem of elemWeNeed) {
        console.log(elem)
        tableau.push(elem.split(':')[1])
        tableau2.push(elem.split(':')[0])
      }
      for (let i = 1; i < tableau.length; i++) {
        if (this.cvss[tableau2[i]] !== undefined) {
          this.cvss[tableau2[i]] = tableau[i]
          this[tableau2[i]][tableau[i]] = true
        }
      }
      this.calculateBaseScore()
    }
  },
  methods: {
    reset(key) {
      Object.keys(this[key]).forEach((e) => (this[key][e] = false))
    },
    changeCode(k, v) {
      this.reset(k)
      this[k][v] = true
      this.cvss[k] = v
      if (!Object.keys(this.cvss).some((e) => this.cvss[e] === '')) {
        this.calculateBaseScore()
      }
    },
    calculateBaseScore() {
      // CALCULATE THE CVSS BASE SCORE

      let impact
      let baseScoreRaw
      let baseScore
      const unchangedScope = this.cvss.S === 'U'
      const exploitability =
        8.22 *
        this.weight.AV[this.cvss.AV] *
        this.weight.AC[this.cvss.AC] *
        this.weight.PR[this.cvss.S][this.cvss.PR] *
        this.weight.UI[this.cvss.UI]

      const iss =
        1.0 -
        (1.0 - this.weight.CIA[this.cvss.C]) *
          (1.0 - this.weight.CIA[this.cvss.I]) *
          (1.0 - this.weight.CIA[this.cvss.A])
      console.log(
        this.weight.AV[this.cvss.AV],
        this.weight.AC[this.cvss.AC],
        this.weight.PR[this.cvss.S][this.cvss.PR],
        this.weight.UI[this.cvss.UI]
      )
      if (unchangedScope) {
        impact = this.weight.S[this.cvss.S] * iss
      } else {
        impact =
          this.weight.S[this.cvss.S] * (iss - 0.029) -
          3.25 * Math.pow(iss - 0.02, 15)
      }
      console.log(impact)
      if (impact <= 0) {
        baseScore = 0
        baseScoreRaw = 0
      } else if (unchangedScope) {
        baseScoreRaw = Math.min(exploitability + impact, 10)
        console.log(baseScoreRaw)
        baseScore = Math.ceil(baseScoreRaw * 10) / 10 // CVSS31.roundUp1(baseScoreRaw)
        console.log(baseScore)
      } else {
        baseScoreRaw = Math.min(1.08 * (exploitability + impact), 10)
        baseScore = Math.ceil(baseScoreRaw * 10) / 10 // CVSS31.roundUp1(baseScoreRaw)
      }
      console.log(baseScore)
      const [info] = this.severityRatings.filter(
        (e) => e.bottom <= baseScore && baseScore <= e.top
      )
      this.form.score = baseScore
      this.form.code =
        'CVSS:3.1/AV:' +
        this.cvss.AV +
        '/AC:' +
        this.cvss.AC +
        '/PR:' +
        this.cvss.PR +
        '/UI:' +
        this.cvss.UI +
        '/S:' +
        this.cvss.S +
        '/C:' +
        this.cvss.C +
        '/I:' +
        this.cvss.I +
        '/A:' +
        this.cvss.A
      this.color = info.color
      this.severity = info.name
      this.$emit('change', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.cvss-parameters {
  > div {
    margin: 10px 0;
  }
  :nth-child(odd) {
    flex-basis: 66%;
    flex-grow: 1;
  }
  :nth-child(even) {
    flex-basis: 33%;
  }
}
</style>
