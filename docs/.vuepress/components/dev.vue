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
        series: [
          {
            type: 'gauge',
            data: [
              { name: 'itemA', value: 55 }
            ]
          }
        ]
      })

      // setTimeout(() => {
      //   myChart.setOption({
      //     title: {
      //       text: 'This is a Chart'
      //     },
      //     radar: {
      //       indicator: [
      //         { name: 'item1', max: 500 },
      //         { name: 'item2', max: 500 },
      //         { name: 'item3', max: 500 },
      //         { name: 'item4', max: 500 },
      //         { name: 'item4', max: 500 },
      //         { name: 'item4', max: 500 },
      //       ],
      //       splitNum: 4
      //     },
      //     series: [
      //       {
      //         type: 'radar',
      //         data: [300, 250, 210, 299, 299, 299]
      //       }
      //     ]
      //   })
      // }, 2000)

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
