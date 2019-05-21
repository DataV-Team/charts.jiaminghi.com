<template>
  <div class="demo">
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
  name: "Demo",
  data () {
    return {}
  },
  methods: {
    init () {
      const { $refs } = this;

      const myChart = new Charts($refs["chart"])

      myChart.setOption({
        title: {
          text: "This is a Chart"
        },
        xAxis: {
          name: "WeekDay",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        yAxis: {
          name: "Count",
          data: "value",
          axisLabel: {
            formatter: "{value} KG"
          },
        },
        series: [
          {
            data: [50, 113, 387, 155, 377, 322],
            type: "bar",
            stack: "a",
            smooth: true,
            fill: {
              show: true,
              gradient: ['rgba(255, 231, 147, .5)', 'rgba(255, 231, 147, .1)']
            },
            lineStyle: {
              lineDash: [5, 5]
            },
            label: {
              show: true
            }
          },
          {
            data: [150, 213, 487, 255, 477, 422],
            type: "bar",
            stack: "a"
          }
        ]
      })

      setTimeout(() => {
        // myChart.setOption({
        //   title: {
        //     text: "This is a Chart"
        //   },
        //   xAxis: {
        //     name: "WeekDay",
        //     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        //     // data: "value"
        //   },
        //   yAxis: {
        //     name: "Count",
        //     data: "value",
        //     axisLabel: {
        //       formatter: "{value} KG"
        //     },
        //     // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        //   },
        //   series: [
        //     {
        //       data: [50, 113, 387, 155, 377, 322],
        //       type: "line",
        //       stack: "a",
        //       smooth: true,
        //       fill: {
        //         show: true,
        //         gradient: ['rgba(255, 231, 147, .5)', 'rgba(255, 231, 147, .1)']
        //       },
        //       lineStyle: {
        //         lineDash: [5, 5]
        //       },
        //       label: {
        //         show: true
        //       }
        //     },
        //     {
        //       data: [150, 213, 487, 255, 477, 422],
        //       type: "bar",
        //       stack: "a"
        //     }
        //   ]
        // })
      }, 2000)

      console.warn(myChart)
    }
  },
  async mounted () {
    // await new Promise(resolve => setTimeout(resolve, 1000))

    this.init()
  }
};
</script>

<style lang="less">
.demo {
  height: 500px;
  box-shadow: 0 0 3px #46bd87;

  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>
