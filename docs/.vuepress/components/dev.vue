<template>
  <div class="dev">
    <div
      class="chart"
      ref="chart"
    />
  </div>
</template>

<script>
import Charts from "../../Charts/index.js"

import transition from "@jiaminghi/transition"

import CRender from "@jiaminghi/c-render"

export default {
  name: "Dev",
  data () {
    return {
      myChart: null
    }
  },
  methods: {
    init () {
      const { $refs } = this;

      const myChart = this.myChart = new Charts($refs["chart"])

      myChart.setOption({
        title: {
          text: 'This is a Chart'
        },
        radar: {
          polygon: true,
          indicator: [
            { name: 'A', max: 500 },
            { name: 'B', max: 500 },
            { name: 'C', max: 500 },
            { name: 'D', max: 500 },
            { name: 'E', max: 500 },
          ]
        },
        series: [
          {
            type: 'radar',
            data: [233, 200, 197, 450, 411]
          }
        ]
      })

      setTimeout(() => {
        myChart.setOption({
        title: {
          text: 'This is a Chart'
        },
        radar: {
          polygon: true,
          indicator: [
            { name: 'A', max: 500 },
            { name: 'B', max: 500 },
            { name: 'C', max: 500 },
            { name: 'D', max: 500 },
            // { name: 'E', max: 500 },
          ],
        },
        series: [
          {
            type: 'radar',
            data: [233, 200, 197, 450]
          }
        ]
      })
      }, 2000)

      console.warn(myChart)
    }
  },
  async mounted () {
    this.init()

    window.addEventListener('resize', e => {
      this.myChart.resize()
    })
  }
}
</script>

<style lang="less">
.dev {
  height: 500px;
  box-shadow: 0 0 1px #46bd87;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
