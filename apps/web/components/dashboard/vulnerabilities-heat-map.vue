<script>
export default {
  name: 'VulnerabilitiesHeatMap',
  data: () => ({
    heatMapData: [
      ['Critical', 0, 0, 69, 4, 81],
      ['High', 0, 8, 1037, 17, 0],
      ['Medium', 0, 11, 2253, 378, 0],
      ['Low', 58, 47, 664, 13, 0]
    ]
  }),
  computed: {
    gridData() {
      // Add ID's to data for v-for
      const data = this.heatMapData.map(row =>
        row.map((data, idx) => {
          let id = row[0]
          if (idx > 0)
            id += `-${this.headers[idx - 1]}`

          return { data, id }
        }),
      )

      // Add classes for data color
      const heatMapClasses = [
        ['Critical', 'safe', 'warning', 'danger', 'danger', 'critical'],
        ['High', 'safe', 'warning', 'warning', 'danger', 'danger'],
        ['Medium', 'safe', 'safe', 'safe', 'warning', 'warning'],
        ['Low', 'safe', 'safe', 'safe', 'safe', 'safe'],
      ]

      for (let i = 0; i < data.length; i++) {
        data[i][0].class = 'heat-map_row-header'
        for (let j = 1; j < data[i].length; j++) {
          data[i][j].class = [
            'heat-map_cell',
            `heat-map_cell--${heatMapClasses[i][j]}`,
          ]
        }
      }
      return data.flat()
    },
  },
  watch: {
    data(newData) {
      this.populateChartData(newData)
    }
  },
  created() {
    this.headers = ['Rare', 'Unlikely', 'Moderate', 'Likely', 'Certain']
    this.populateChartData(this.data)
  },
  methods: {
    populateChartData(likelihoods) {
      const { critical, high, medium, low } = likelihoods
      this.heatMapData = [
        [
          'Critical',
          critical.rare,
          critical.unlikely,
          critical.moderate,
          critical.likely,
          critical.certain,
        ],
        [
          'High',
          high.rare,
          high.unlikely,
          high.moderate,
          high.likely,
          high.certain,
        ],
        [
          'Medium',
          medium.rare,
          medium.unlikely,
          medium.moderate,
          medium.likely,
          medium.certain,
        ],
        ['Low', low.rare, low.unlikely, low.moderate, low.likely, low.certain],
      ]
    },
    showDataDetails(data) {
      const [severities, likelihoods] = data.id
        .split('-')
        .map(s => s.toLowerCase())

      this.$router.push({
        path: this.localePath('vulnerabilities'),
        query: { likelihoods, severities },
      })
    },
  },
  props: {
    data: {
      required: false,
      type: Object,
    },
  },
}
</script>

<template>
  <v-card class="vulnerabilities-heat-map">
    <v-card-title>
      Vulnerabilities Heat Map<v-spacer /><v-icon @click="$emit('close')">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="dash-text overflow-y-auto">
      <div class="heat-map">
        <!-- Headers -->
        <div class="heat-map_column-header" />
        <div
          v-for="(header, hidx) of headers"
          :key="hidx"
          class="heat-map_column-header"
        >
          {{ header }}
        </div>

        <!-- Heat Map Data -->
        <div
          v-for="d of gridData"
          :key="d.id"
          :class="d.class"
          @click="showDataDetails(d)"
        >
          {{ d.data }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.vulnerabilities-heat-map {
  .heat-map {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    row-gap: 8px;

    &_column-header {
      font-weight: 600;
      text-align: center;
    }

    &_row-header {
      font-weight: 600;
    }

    &_cell {
      cursor: pointer;
      text-align: center;
      font-weight: 500;
      &:hover {
        background-color: #000000 !important;
      }

      &--safe {
        color: white !important;
        background-color: #60b044;
      }
      &--warning {
        color: white !important;
        background-color: #ed9b0e;
      }
      &--danger {
        color: white !important;
        background-color: #d92b2b;
      }
      &--critical {
        color: white !important;
        background-color: #941e1e;
      }
    }
  }
}
</style>
