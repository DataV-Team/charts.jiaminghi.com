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
          text: '周销售额趋势'
        },
        xAxis: {
          name: '第二周',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          name: '销售额',
          data: 'value',
          min: 0
        },
        legend: {
          data: ['a', 'b', 'c']
        },
        series: [
          {
            name: 'a',
            data: [100, 80, 60, 40, 120, 30, 90],
            type: 'bar'
          },
          {
            name: 'b',
            data: [100, 80, 60, 40, 120, 30, 90],
            type: 'bar'
          },
          {
            name: 'c',
            data: [100, 80, 60, 40, 120, 30, 90],
            type: 'line'
          }
        ]
      })

      // setTimeout(() => {
      //   myChart.setOption({
      //     title: {
      //       text: '周销售额趋势'
      //     },
      //     xAxis: {
      //       name: '第二周',
      //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      //     },
      //     yAxis: {
      //       name: '销售额',
      //       data: 'value'
      //     },
      //     series: [
      //       {
      //         data: [0, 0, 100, 0, 0, 0, 0],
      //         type: 'bar'
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
