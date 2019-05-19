<template>
  <div class="demo">
    <div
      class="chart"
      ref="chart"
    />
  </div>
</template>

<script>
import Charts from "../../Charts/index.js";

import transition from "@jiaminghi/transition";

import CRender from "@jiaminghi/c-render";

export default {
  name: "Demo",
  data() {
    return {};
  },
  methods: {
    init() {
      const { $refs } = this;

      const myChart = new Charts($refs["chart"]);

      myChart.setOption({
        title: {
          text: "This is a Chart"
        },
        xAxis: {
          name: "WeekDay",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          // data: "value"
        },
        yAxis: {
          name: "Count",
          data: "value",
          axisLabel: {
            formatter: "{value} KG"
          }
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
          {
            data: [162, 220, 387, 155, 377, 266, 198],
            type: "line",
            stack: "a",
            fill: {
              show: true
            }
          },
          {
            data: [162, 220, 387, 155, 377, 266, 198],
            type: "line",
            stack: "a"
          }
        ]
      })

      // setTimeout(() => {
      //   myChart.setOption({
      //     xAxis: {
      //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //     },
      //     yAxis: {
      //       data: 'value'
      //     },
      //     series: [{
      //       data: [820, 932, 100, 934, 1290, 1330, 1320],
      //       type: 'line'
      //     }]
      //   })
      //   console.log(11)
      // }, 3000)

      console.warn(myChart);
    }
  },
  mounted() {
    this.init();
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
