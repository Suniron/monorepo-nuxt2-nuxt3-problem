<template>
  <div :id="id" class="gauge-chart"></div>
</template>

<script>
import 'billboard.js/dist/billboard.css'
import 'billboard.js/dist/theme/insight.css'

export default {
  name: 'GaugeChart',
  props: {
    /**
     * ID used to bind the chart element
     */
    id: {
      type: String,
      required: true
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
      type: Object,
      required: true,
      validator(chartData) {
        // All data points should have a numeric value
        return Object.values(chartData).every(
          (dataObj) => !isNaN(dataObj.value)
        )
      }
    },
    /**
     * Configuration object that overrides certain default configurations
     * of this chart
     */
    config: {
      type: Object,
      default: () => ({})
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
  mounted() {
    // Import billboard here, so it's only imported in client-side
    const { bb, gauge } = require('billboard.js')
    const data = this.createChartDataConfig(this.data)

    const outputsize = () => {
      this.chart.resize()
    }

    new ResizeObserver(outputsize).observe(this.$el)

    const colors = this.colors
    this.chart = bb.generate({
      // Overridable configuration
      legend: {
        show: false
      },
      tooltip: {
        show: false
      },
      color: {
        pattern: [
          colors['dark-red'],
          colors.red,
          colors.orange,
          colors.yellow,
          colors.green
        ],
        threshold: {
          values: [9, 29, 69, 89, 100]
        }
      },
      ...this.config,

      // Non-overridable configuration
      data: {
        ...data,
        onclick: (data, el) => {
          this.$emit('click', { data, el })
        },
        type: gauge()
      },
      bindto: `#${this.id}`
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
          } else {
            throw new TypeError(
              `[PieChart] Invalid data configuration. ${name} should be a number or an array of numbers`
            )
          }
        }
      }

      // Colors
      let colors
      // If a color is defined for any of the data points
      if (Object.values(data).some((config) => !!config.color)) {
        colors = {}

        for (const name in data) {
          if (data.hasOwnProperty(name)) {
            const config = data[name]

            if (config.color) {
              colors[name] = config.color
            }
          }
        }
      }

      const chartData = { columns, colors }

      return chartData
    },
    reloadChartData() {
      if (this.chart) {
        const { columns } = this.createChartDataConfig(this.data)

        const self = this
        this.chart.load({
          columns,
          done: () => {
            this.chart.resize()
            self.$emit('loaded')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.gauge-chart {
  width: 100%;
  height: 100%;
  .bb-shape.bb-shape.bb-arc {
    stroke: none;
  }
  // .bb-gauge-value {
  //   fill: white;
  // }
}
</style>
