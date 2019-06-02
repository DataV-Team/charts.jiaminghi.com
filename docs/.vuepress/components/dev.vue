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

import transition from "@jiaminghi/transition"

import CRender from "@jiaminghi/c-render"

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
          text: 'This is a Chart'
        },
        series: [
          {
            type: 'gauge',
            data: [
              {
                name: 'itemA',
                value: 55,
                gradient: ['#f51007', '#f97c03', '#fedc00']
              },
              // {
              //   name: 'itemB',
              //   value: 65,
              //   radius: '20%',
              //   gradient: ['#f51007', '#f97c03', '#fedc00']
              // },
              // {
              //   name: 'itemC',
              //   value: 75,
              //   radius: '10%',
              //   gradient: ['#f51007', '#f97c03', '#fedc00']
              // },
            ],
            splitNum: 7,
            axisLabel: {
              data: ['差', '', '中', '', '良', '', '优']
            },
            details: {
              show: true,
              formatter: '{value}%',
              offset: [0, 40],
              style: {
                fontSize: 25
              }
            }
          }
        ]
      })

      setTimeout(() => {
        myChart.setOption({
        title: {
          text: 'This is a Chart'
        },
        series: [
          {
            type: 'gauge',
            data: [
              {
                name: 'itemA',
                value: 99,
                gradient: ['#f51007', '#f97c03', '#fedc00']
              },
              // {
              //   name: 'itemB',
              //   value: 65,
              //   radius: '20%',
              //   gradient: ['#f51007', '#f97c03', '#fedc00']
              // },
              // {
              //   name: 'itemC',
              //   value: 75,
              //   radius: '10%',
              //   gradient: ['#f51007', '#f97c03', '#fedc00']
              // },
            ],
            splitNum: 7,
            axisLabel: {
              data: ['差', '', '中', '', '良', '', '优']
            },
            details: {
              show: true,
              formatter: '{value}%',
              offset: [0, 40],
              style: {
                fontSize: 25
              }
            }
          }
        ]
      })
      }, 2000)

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
