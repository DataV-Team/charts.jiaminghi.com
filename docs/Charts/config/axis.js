const xAxisConfig = {
  name: '',
  show: true,
  position: 'bottom',
  offset: 0,
  nameLocation: 'start',
  nameTextStyle: {},
  nameGap: 10,
  min: '20%',
  max: '20%',
  interval: null,
  minInterval: null,
  maxInterval: null,
  boundaryGap: true,
  splitNumber: 5,
  axisLine: {
    show: true,
    style: {
      stroke: '#b6b6b6'
    }
  },
  axisTick: {
    show: true,
    style: {}
  },
  axisLable: {
    show: true,
    style: {}
  },
  splitLine: {
    show: true,
    style: {}
  },
  axisPointer: {
    show: false,
    type: 'shadow'
  },
  inverse: false
}

const yAxisConfig = {
  name: '',
  show: true,
  position: 'left',
  offset: 0,
  nameLocation: 'start',
  nameTextStyle: {},
  nameGap: 10,
  min: '20%',
  max: '20%',
  interval: null,
  minInterval: null,
  maxInterval: null,
  boundaryGap: true,
  splitNumber: 5,
  axisLine: {
    show: true,
    style: {
      stroke: '#b6b6b6'
    }
  },
  axisTick: {
    show: true,
    style: {}
  },
  axisLable: {
    show: true,
    style: {}
  },
  splitLine: {
    show: true,
    style: {}
  },
  axisPointer: {
    show: false,
    type: 'shadow'
  },
  inverse: false
}

export const axisConfig = {
  xAxisConfig,
  yAxisConfig
}