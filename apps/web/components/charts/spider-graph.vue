<script>
// @ts-check
import 'billboard.js/dist/billboard.css'
import 'billboard.js/dist/theme/insight.css'

export default {
  name: 'SpiderGraph',
  data() {
    return {
      isExporting: false
    }
  },
  mounted() {
    // Import billboard here, so it's only imported in client-side
    const { bb, radar } = require('billboard.js')

    const data = this.createChartDataConfig(this.data)
    const chartConfig = {
      data: {
        ...data,
        type: radar(),
        x: 'x',
        labels: true,
      },
      bindto: `#chart-${this.id}`,
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
      }
    }
    this.chart = bb.generate(chartConfig)
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.reloadChartData()
      },
    }
  },
  methods: {
    createChartDataConfig(data) {
      // Values
      const columns = []
      for (const name in data) {
        if (data.hasOwnProperty(name)) {
          if (
            (name === 'x'
              && Array.isArray(data[name].value)
              && data[name].value.every(val => typeof val === 'string'))
            || (Array.isArray(data[name].value)
              && data[name].value.every(val => !isNaN(val)))
          ) {
            const col
              = name === 'x'
                ? [name, ...data[name].value]
                : [name, ...data[name].value.map(d => Number(d))]
            columns.push(col)
          }
        }
      }
      return { columns }
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
    },
    reloadChartData() {
      if (this.chart) {
        const { columns } = this.createChartDataConfig(this.data)
        this.chart.load({
          columns,
        })
      }
    },
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
    exportFileName: {
      default: null,
      type: String,
    },
    id: {
      required: true,
      type: String,
    },
    title: {
      default: '',
      type: String,
    },
  },
}
</script>

<template>
  <div :id="id" style="position: relative;">
    <div v-if="title || exportFileName" class="d-flex align-center">
      <p v-if="title" class="graph-title">
        {{ title }}
      </p>
      <v-spacer />
      <v-btn
        v-if="exportFileName"
        title="download the graph"
        :loading="isExporting"
        icon
        color="primary"
        @click="exportGraph"
      >
        <v-icon>mdi-image-move</v-icon>
      </v-btn>
    </div>
    <div :id="`chart-${id}`" class="spider-graph" />
  </div>
</template>

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
