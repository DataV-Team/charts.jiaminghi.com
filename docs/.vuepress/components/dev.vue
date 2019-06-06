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
  // methods: {
  //   init () {
  //     const { $refs } = this;

  //     const myChart = this.myChart = new Charts($refs["chart"])

  //     myChart.setOption({
  //       title: {
  //         text: '周销售额趋势'
  //       },
  //       xAxis: {
  //         name: '第二周',
  //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  //       },
  //       yAxis: {
  //         name: '销售额',
  //         data: 'value'
  //       },
  //       series: [
  //         {
  //           data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
  //           type: 'line',
  //           lineArea: {
  //             show: true
  //           }
  //         }
  //       ]
  //     })

  //     setTimeout(() => {
  //       myChart.setOption({
  //         title: {
  //           text: '周销售额趋势'
  //         },
  //         xAxis: {
  //           name: '第二周',
  //           data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  //         },
  //         yAxis: {
  //           name: '销售额',
  //           data: 'value'
  //         },
  //         series: [
  //           {
  //             data: [2339, 1899, 2118, 1790, 3265, 4465, 3996],
  //             type: 'line',
  //             lineArea: {
  //               show: true
  //             }
  //           }
  //         ]
  //       })
  //     }, 2000)

  //     console.warn(myChart)
  //   }
  // },
  // async mounted () {
  //   this.init()

  //   window.addEventListener('resize', e => {
  //     this.myChart.resize()
  //   })
  // }
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
