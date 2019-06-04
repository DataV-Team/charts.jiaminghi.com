const option1 = {
  title: {
    text: '剩余油量表'
  },
  series: [
    {
      type: 'gauge',
      data: [ { name: 'itemA', value: 55 } ],
      axisLabel: {
        formatter: '{value}%'
      },
      details: {
        show: true,
        offset: [0, 40],
        formatter: '剩余{value}%'
      }
    }
  ]
}

const option2 = {
  title: {
    text: '剩余油量表'
  },
  series: [
    {
      type: 'gauge',
      data: [ { name: 'itemA', value: 89 } ],
      axisLabel: {
        formatter: '{value}%'
      },
      details: {
        show: true,
        offset: [0, 40],
        formatter: '剩余{value}%'
      }
    }
  ]
}

export default [option1, option2]