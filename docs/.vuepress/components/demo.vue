<template>
  <div class="demo">
    <div class="chart" ref="chart" @click="setOption" title="点击以切换图表配置"/>
  </div>
</template>

<script>
import Charts from "../../Charts/index.js"

export default {
  name: "Demo",
  props: ['option', 'debug'],
  data () {
    return {
      myChart: null,
      optionIndex: 0
    }
  },
  methods: {
    init () {
      const { $refs, setOption } = this

      this.myChart = new Charts($refs["chart"])

      setOption()
    },
    setOption () {
      const { myChart, optionIndex, option, debug } = this

      myChart.setOption(option[optionIndex])

      const optionNum = option.length

      this.optionIndex++

      if (optionIndex + 1 >= optionNum) this.optionIndex = 0

      if (debug) console.warn(myChart)
    }
  },
  async mounted () {
    this.init()
  }
}
</script>

<style lang="less">
.demo {
  height: 500px;
  box-shadow: 0 0 1px #46bd87;

  .chart {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
