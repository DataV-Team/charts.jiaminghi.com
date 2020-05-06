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

const option = {"series":[{"type":"pie","radius":"50%","activeRadius":"55%","data":[{"name":"周口","value":16984,"radius":[65,85]},{"name":"南阳","value":48872,"radius":[65,85]},{"name":"西峡","value":17366,"radius":[65,85]},{"name":"驻马店","value":6101,"radius":[65,85]},{"name":"新乡","value":3197,"radius":[65,85]},{"name":"郑州","value":97,"radius":[65,85]}],"lineWidth":20,"activeTimeGap":3000,"color":[],"digitalFlopStyle":{"fontSize":25,"fill":"#fff"},"digitalFlopToFixed":2,"animationCurve":"easeOutCubic","animationFrame":50,"showOriginValue":false,"showValue":true,"fontSize":14,"outsideLabel":{"show":false}, outsideLabel: {show: true, formatter: '{percent}'}}],"color":[]}

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
