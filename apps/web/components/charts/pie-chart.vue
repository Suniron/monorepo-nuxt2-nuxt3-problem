<script>
import 'billboard.js/dist/billboard.css'
import 'billboard.js/dist/theme/insight.css'
import { bb, pie } from 'billboard.js'

export default {
  created() {
    // Non-reactive data
    this.chart = null
    this.colors = {
      yellow: '#f0d802',
      orange: '#ed9b0e',
      red: '#d92b2b',
      'dark-red': '#941e1e',
      green: '#60B044'
    }
  },
  name: 'PieChart',
  props: {

    /**
     * Configuration object that overrides certain default configurations
     * of this chart
     */
    config: {
      default: () => ({}),
      type: Object,
    },

    /**
     * Data that will be rendered in the pie chart.
     * It should have the following structure:
     *
     * {
     *   data1: {
     *     value: number, // Value at pie chart
     *     color: string? // Optional. Hexadecimal color i.e. '#b0c2d1'
     *   },
     *   data2: {},
     *   data3: {}
     * }
     */
    data: {
      required: true,
      type: Object,
      validator(chartData) {
        // All data points should have a numeric value or an array of numeric values
        return Object.values(chartData).every(
          dataObj => !isNaN(dataObj.value),
        )
      },
    },

    /**
     * ID used to bind the chart element
     */
    id: {
      required: true,
      type: String,
    },
  },
  mounted() {

    const data = this.createChartDataConfig(this.data)
    const self = this
    this.chart = bb.generate({
      // Overridable configuration
      ...this.config,

      bindto: `#${this.id}`,
      // Non-overridable configuration
      data: {
        ...data,
        onclick(data, el) {
          self.$emit('click', { data, el })
        },
        type: pie()
      },
    })
    this.chart.resize()
  },
  methods: {
    createChartDataConfig(data) {
      // Values
      const columns = []
      for (const name in data) {
        if (data.hasOwnProperty(name)) {
          if (!isNaN(data[name].value)) {
            columns.push([name, Number(data[name].value)])
          }
          else {
            throw new TypeError(
              `[PieChart] Invalid data configuration. ${name} should be a number or an array of numbers`,
            )
          }
        }
      }

      // Colors
      let colors
      // If a color is defined for any of the data points
      if (Object.values(data).some(config => !!config.color)) {
        colors = {}

        for (const name in data) {
          if (data.hasOwnProperty(name)) {
            const config = data[name]

            if (config.color)
              colors[name] = config.color
          }
        }
      }

      const chartData = { colors, columns }

      return chartData
    },
    reloadChartData() {
      if (this.chart) {
        const { columns } = this.createChartDataConfig(this.data)

        const self = this
        this.chart.load({
          columns,
          done() {
            self.$emit('loaded')
          },
        })
      }
    },
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.reloadChartData()
      },
    },
  },
}
</script>

<template>
  <div :id="id" class="pie-chart" />
</template>

<style lang="scss">
.pie-chart {
  width: 100%;
  height: 100%;
  .bb-target {
    cursor: pointer;
  }
  .bb-tooltip-container {
    table.bb-tooltip {
      // background-color: black;
      border: none;
      border-spacing: 2px;
      border-radius: 4px;
      td {
        // background-color: black;
        border: none;
      }
    }
  }
  // .bb-legend {
  //   .bb-legend-item {
  //     text {
  //       fill: white;
  //     }
  //   }
  // }
  .bb-shape.bb-shape.bb-arc {
    stroke: none;
  }
}
</style>
