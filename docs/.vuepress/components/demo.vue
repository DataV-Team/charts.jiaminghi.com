<template>
  <div class="demo">
    <div class="chart" ref="chart" />
  </div>
</template>

<script>
import Charts from '../../Charts/index.js'

import transition from '@jiaminghi/transition'

import CRender from '@jiaminghi/c-render'

export default {
  name: 'Demo',
  data () {
    return {}
  },
  methods: {
    init () {
      const { $refs } = this

      const myChart = new Charts($refs['chart'])

      myChart.setOption({
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          data: 'value'
        },
        series: [{
          data: [820, 932, -11, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })

      console.error(myChart)
    }
  },
  mounted () {
    this.init()
  }
}
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
