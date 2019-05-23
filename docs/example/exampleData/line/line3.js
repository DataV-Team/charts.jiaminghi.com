const option1 = {
  title: {
    text: "周销售额趋势"
  },
  xAxis: {
    name: '第一周',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    name: '销售额',
    data: "value"
  },
  series: [
    {
      data: [3350, 5530, 4500, 5100, 7711, 9500, 8900],
      type: 'line',
      lineStyle: {
        lineDash: [5, 5]
      }
    }
  ]
}

const option2 = {
  title: {
    text: "周销售额趋势"
  },
  xAxis: {
    name: '第二周',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    name: '销售额',
    data: "value"
  },
  series: [
    {
      data: [5630, 5530, 5440, 6500, 8866, 9233, 9500],
      type: 'line',
      lineStyle: {
        lineDash: [10, 10]
      }
    }
  ]
}

export default [option1, option2]