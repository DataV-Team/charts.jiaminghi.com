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
    async init () {
      const { $refs, randomNum } = this;

      const myChart = this.myChart = new Charts($refs["chart"])

      myChart.setOption({
        color: ['#19aef2', '#4bdbc6', '#f87421'],
        title: {
          text: '本日采购单类型金额占比',
          style: {
            fill: 'white',
          },
          show: false
        },
        series: [
          {
            type: 'pie',
            data: [
              { name: '统采', value: 22633.86 },
              { name: '补采', value: 3468.28 },
              // { name: '临采', value: 100 },
            ],
            insideLabel: {
              show: true
            },
            percentToFixed: 2
          }
        ]
      }, true)
    },
    randomNum (minNum, maxNum){ 
      switch(arguments.length){ 
        case 1:
          return parseInt(Math.random() * minNum + 1, 10)
        break
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum,10)
        break
        default:
            return 0
        break
      }
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
