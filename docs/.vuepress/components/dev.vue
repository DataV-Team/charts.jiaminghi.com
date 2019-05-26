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
    return {}
  },
  methods: {
    init () {
      const { $refs } = this;

      const myChart = new Charts($refs["chart"])

      myChart.setOption({
        title: {
          text: 'This is a Chart'
        },
        series: [
          {
            type: 'pie',
            data: [
              {
                name: 'itemA',
                value: 93
              },
              {
                name: 'itemB',
                value: 32
              },
              {
                name: 'itemC',
                value: 65
              },
              {
                name: 'itemD',
                value: 44
              }
            ],
            radius: ['40%', '50%']
          },
          {
            type: 'pie',
            data: [
              {
                name: 'itemA',
                value: 93
              },
              {
                name: 'itemB',
                value: 32
              },
              {
                name: 'itemC',
                value: 65
              },
              {
                name: 'itemD',
                value: 44
              }
            ],
            radius: ['0%', '30%'],
            insideLabel: {
              show: true
            },
            outsideLabel: {
              show: false
            }
            // roseType: true
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
              type: 'pie',
              data: [
                {
                  name: 'itemA',
                  value: 93
                },
                {
                  name: 'itemB',
                  value: 32
                },
                {
                  name: 'itemC',
                  value: 65
                },
                {
                  name: 'itemD',
                  value: 44
                },
                {
                  name: 'itemE',
                  value: 32
                }
              ],
              radius: ['40%', '50%']
            },
            {
              show: false,
              type: 'pie',
              data: [
                {
                  name: 'itemA',
                  value: 93
                },
                {
                  name: 'itemB',
                  value: 32
                },
                {
                  name: 'itemC',
                  value: 65
                },
                {
                  name: 'itemD',
                  value: 44
                },
                {
                  name: 'itemE',
                  value: 32
                }
              ],
              radius: ['0%', '30%'],
              insideLabel: {
                show: true
              },
              outsideLabel: {
                show: false
              },
              roseType: true
            }
          ]
        })
      }, 2000)

      console.warn(myChart)
    }
  },
  async mounted () {
    this.init()
  }
};
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
