const option1 = {
  radar: {
    polygon: true,
    indicator: [
      { name: '西峡', max: 300 },
      { name: '周口', max: 300 },
      { name: '南阳', max: 300 },
      { name: '驻马店', max: 300 },
      { name: '郑州', max: 300 },
      { name: '洛阳', max: 300 }
    ]
  },
  series: [
    {
      type: 'radar',
      data: [111, 256, 178, 152, 266, 132],
      label: {
        show: false
      }
    },
    {
      type: 'radar',
      data: [222, 245, 220, 130, 240, 100],
      label: {
        show: false
      }
    }
  ]
}

const option2 = {
  radar: {
    polygon: true,
    indicator: [
      { name: '西峡', max: 300 },
      { name: '周口', max: 300 },
      { name: '南阳', max: 300 },
      { name: '驻马店', max: 300 },
      { name: '郑州', max: 300 },
      { name: '洛阳', max: 300 }
    ]
  },
  series: [
    {
      type: 'radar',
      data: [223, 189, 214, 265, 178, 155],
      label: {
        show: false
      }
    },
    {
      type: 'radar',
      data: [116, 256, 280, 244, 240, 255],
      label: {
        show: false
      }
    }
  ]
}

export default [option1, option2]