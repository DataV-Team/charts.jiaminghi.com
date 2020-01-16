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

let option = `{"series":[{"type":"pie","radius":"55%","activeRadius":"60%","data":[{"name":"公安","value":1799,"radius":[67.5,97.5]},{"value":1789,"name":"人社","radius":[67.5,97.5]},{"value":1043,"name":"医保","radius":[67.5,97.5]},{"value":787,"name":"住建","radius":[67.5,97.5]},{"value":587,"name":"总工会","radius":[67.5,97.5]},{"value":251,"name":"档案","radius":[67.5,97.5]},{"value":136,"name":"民政","radius":[67.5,97.5]},{"value":46,"name":"卫健","radius":[67.5,97.5]},{"value":35,"name":"残联","radius":[67.5,97.5]},{"value":19,"name":"公安1","radius":[67.5,97.5]},{"value":7,"name":"粮食","radius":[67.5,97.5]}],"lineWidth":30,"activeTimeGap":3000,"color":["#e8dd82","#ff34a3","#c716e8","#4ae814","#100de8","#e80700","#797B7F","#CFB2A9","#DE9325","#7FAE90","#9FDABF","#E98F6F","#6AB0B8","#334B5C","#fc0503"],"digitalFlopStyle":{"fontSize":25,"fill":"#fff"},"digitalFlopToFixed":0,"animationCurve":"easeOutCubic","animationFrame":50,"outsideLabel":{"show":false}}],"color":["#e8dd82","#ff34a3","#c716e8","#4ae814","#100de8","#e80700","#797B7F","#CFB2A9","#DE9325","#7FAE90","#9FDABF","#E98F6F","#6AB0B8","#334B5C","#fc0503"]}`

option = JSON.parse(option)

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

      myChart.setOption(option, true)
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
    background-color: gray;
  }
}
</style>
