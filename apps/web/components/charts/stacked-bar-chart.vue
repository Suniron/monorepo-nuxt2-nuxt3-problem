<script>
import 'billboard.js/dist/billboard.css'
import 'billboard.js/dist/theme/insight.css'
import { bar, bb } from 'billboard.js'

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
  name: 'StackedBarChart',
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
        return Object.entries(chartData).every(
          ([name, dataObj]) =>
            (name === 'x'
              && Array.isArray(dataObj.value)
              && dataObj.value.every(val => typeof val === 'string'))
            || (Array.isArray(dataObj.value)
              && dataObj.value.every(val => !isNaN(val))),
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
    const chartConfig = {
      // Overridable configuration
      ...self.config,

      axis: {
        x: {
          tick: {
            culling: {
              max: 2, // Show only 2 ticks values on x axis
              lines: false
            },
            format: '%Y-%m-%dT%H:%M:%S.%LZ'
          },
          type: 'timeseries'
        },
      },
      
bindto: `#${this.id}`,
      // Non-overridable configuration
data: {
        ...data,
        type: bar(),
        groups: [Object.keys(self.data).filter((key) => key !== 'x')],
        onclick(data, el) {
          self.$emit('click', { data, el })
        }
      },
    }

    if (this.config && this.config.data && this.config.data.order)
      chartConfig.data.order = this.config.data.order

    if (this.config && this.config.data && this.config.data.x)
      chartConfig.data.x = this.config.data.x


    this.chart = bb.generate(chartConfig)
    this.chart.resize()
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
          else if (isNaN(data[name].value)) {
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
      if (data.order)
        chartData.order = data.order

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
  <div :id="id" class="stacked-bar-chart" />
</template>

<style lang="scss">
.stacked-bar-chart {
  width: 100%;
  height: 100%;
}
</style>
