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
          data: 'value',
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
        yAxis: {
          name: "Count",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          data: "value",
          axisLabel: {
            formatter: '{value} KG'
          },
        },
        series: [
          {
            data: [50, 113, null, 155, 377, 322],
            type: 'line',
            shapeType: 'leftEchelon',
            // stack: "a",
            smooth: true,
            fill: {
              show: true,
              gradient: ['rgba(255, 231, 147, .5)', 'rgba(255, 231, 147, .1)']
            },
            lineStyle: {
              lineDash: [5, 5]
            },
          },
          {
            data: [150, 213, 199, null, 477, 422],
            type: 'line',
            shapeType: 'rightEchelon',
            // stack: "a"
          }
        ]
      })

      setTimeout(() => {
        myChart.setOption({
          title: {
            text: "This is a Chart"
          },
          xAxis: {
            name: "WeekDay",
            data: 'value',
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          },
          yAxis: {
            name: "Count",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            data: "value",
            axisLabel: {
              formatter: "{value} KG"
            },
          },
          series: [
            {
              data: [150, 223, null, 167, 415, 350],
              type: 'line',
              shapeType: 'leftEchelon',
              // stack: "a",
              smooth: true,
              fill: {
                show: true,
                gradient: ['rgba(255, 231, 147, .5)', 'rgba(255, 231, 147, .1)']
              },
              lineStyle: {
                lineDash: [5, 5]
              },
            },
            {
              data: [255, 213, 422, 150, 477, 255],
              type: "line",
              label: {
                show: true
              },
              shapeType: 'rightEchelon',
              // stack: "a"
            }
          ]
        })
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
