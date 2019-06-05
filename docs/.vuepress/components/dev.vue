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
            text: '畅销饮料占比饼状图'
        },
        series: [
          {
            type: 'pie',
            roseType: true,
            data: [
              { name: '可口可乐', value: 95 },
              { name: '百事可乐', value: 1 },
              { name: '哇哈哈', value: 1 },
              { name: '康师傅', value: 1 },
              { name: '统一', value: 52 },
            ],
            insideLabel: {
              show: true
            }
          }
        ]
      })

      // setTimeout(() => {
      //   myChart.setOption({
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
