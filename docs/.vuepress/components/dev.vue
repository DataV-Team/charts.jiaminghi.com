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

      for (let i = 0; i < 99999; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))

        myChart.setOption({
          series: [
            {
              type: 'pie',
              data: [
                { name: '可口可乐', value: randomNum(30, 100) },
                { name: '百事可乐', value: randomNum(30, 80) },
                { name: '哇哈哈', value: randomNum(30, 60) },
                { name: '康师傅', value: randomNum(40, 100) },
                { name: '统一', value: randomNum(50, 100) },
              ],
              radius: ['40%', '50%'],
              insideLabel: {
                show: true
              }
            }
          ]
        }, true)
      }
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
