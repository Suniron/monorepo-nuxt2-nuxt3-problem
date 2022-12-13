<script>
import { searchVulnerabilitiesWithTheirAssetsService } from '~/services/vulnerabilities'

export default {
  name: 'TopVulnerabilitis',
  data: () => ({
    topVulnerabilities: [
      {
        title: '',
        value: 0
      },
      {
        title: '',
        value: 0
      },
      {
        title: '',
        value: 0
      },
      {
        title: '',
        value: 0
      },
      {
        title: '',
        value: 0
      }
    ]
  }),
  created() {
    this.populateChartData(this.data)
    // this.fetchVulnerabilities()
  },
  watch: {
    data(newVulns) {
      this.populateChartData(newVulns)
    },
  },
  methods: {
    async fetchVulnerabilities() {
      try {
        const {
          vulnerabilities,
        } = await searchVulnerabilitiesWithTheirAssetsService(this.$axios)

        vulnerabilities.sort((a, b) => {
          if (a.affectedAssets && b.affectedAssets)
            return b.affectedAssets.length - a.affectedAssets.length

          return a
        })
        this.vulnerabilities = vulnerabilities.slice(0, 5)
        this.populateChartData(this.vulnerabilities)
      }
      catch (error) {
        console.error(error)
      }
    },
    populateChartData(vulnerabilities) {
      if (vulnerabilities.length > 0) {
        const total = vulnerabilities.reduce((prev, cur) => {
          prev += cur.ocurrences
          return prev
        }, 0)
        console.log('TOTAL', total)
        this.topVulnerabilities = vulnerabilities.map(vul => ({
          title: vul.name,
          total,
          value: vul.ocurrences,
          // value: vul.affectedAssets.length
        }))
      }
    },
  },
  props: {
    data: {
      default: () => [],
      type: Array,
    },
  },
}
</script>

<template>
  <v-card class="top-vulnerabilities d-flex flex-column">
    <v-card-title>
      Top 5 Vulnerabilities<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text d-flex flex-column overflow-y-auto">
      <!-- <p><span class="red-dot"></span># of affected assets</p> -->
      <v-responsive class="overflow-y-auto">
        <!-- <div class="vulnerabilities"> -->
        <div v-for="(vuln, idx) of topVulnerabilities" :key="idx">
          <p style="font-size:1em; margin-bottom: 0px;">
            <v-btn
              color="primary"
              small
              plain
              link
              nuxt
              :to="`/vulnerabilities?search=${vuln.title}`"
            >
              {{ vuln.title }}
            </v-btn>
          </p>
          <v-progress-linear
            :value="Math.ceil((vuln.value * 100) / vuln.total)"
            style="margin-bottom: 10px;"
            color="amber"
            height="15"
          >
            {{ vuln.value }} affected assets
          </v-progress-linear>
        </div>

        <!-- </div> -->
      </v-responsive>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.top-vulnerabilities {
  .red-dot {
    &::after {
      content: '';
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 200px;
      margin-right: 8px;
      vertical-align: middle;
      position: relative;
      bottom: 1px;
      background: #f45722;
    }
  }

  .vulnerabilities {
    margin: 20px 0;

    > div {
      margin: 8px 0px;
    }
  }
}
</style>
