<template>
  <div :id="id" style="position: relative;">
    <div v-if="title || exportFileName" class="d-flex align-center">
      <p v-if="title" class="graph-title">{{ title }}</p>
      <v-spacer />
      <v-btn
        v-if="exportFileName"
        title="download the graph"
        @click="exportGraph"
        :loading="isExporting"
        icon
        color="primary"
      >
        <v-icon>mdi-image-move</v-icon>
      </v-btn>
    </div>
    <div :id="`chart-${id}`" class="spider-graph" />
  </div>
</template>

<script>
// @ts-check
import 'billboard.js/dist/billboard.css'
import 'billboard.js/dist/theme/insight.css'

export default {
  name: 'SpiderGraph',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      required: true
    },
    exportFileName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isExporting: false
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.reloadChartData()
      }
    }
  },
  mounted() {
    // Import billboard here, so it's only imported in client-side
    const { bb, radar } = require('billboard.js')

    const data = this.createChartDataConfig(this.data)
    const chartConfig = {
      data: {
        ...data,
        x: 'x',
        type: radar(),
        labels: true
      },
      radar: {
        size: {
          ratio: 0.8
        },
        axis: {
          max: 10
        },
        level: {
          depth: 5
        },
        direction: {
          clockwise: true
        }
      },
      bindto: `#chart-${this.id}`
    }
    this.chart = bb.generate(chartConfig)
  },
  methods: {
    createChartDataConfig(data) {
      // Values
      const columns = []
      for (const name in data) {
        if (data.hasOwnProperty(name)) {
          if (
            (name === 'x' &&
              Array.isArray(data[name].value) &&
              data[name].value.every((val) => typeof val === 'string')) ||
            (Array.isArray(data[name].value) &&
              data[name].value.every((val) => !isNaN(val)))
          ) {
            const col =
              name === 'x'
                ? [name, ...data[name].value]
                : [name, ...data[name].value.map((d) => Number(d))]
            columns.push(col)
          }
        }
      }
      return { columns }
    },
    reloadChartData() {
      if (this.chart) {
        const { columns } = this.createChartDataConfig(this.data)
        this.chart.load({
          columns
        })
      }
    },
    exportGraph() {
      this.isExporting = true
      this.chart.export({ mimeType: 'image/png' }, (dataUrl) => {
        const link = document.createElement('a')

        link.download = this.exportFileName ?? 'chart.png'
        link.href = dataUrl
        link.innerHTML = 'Download chart as image'

        link.click()
        this.isExporting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.spider-graph {
  width: 100%;
  height: 100%;
}

.graph-title {
  margin: 0px;
  width: 100%;
  text-align: center;
}
</style>
