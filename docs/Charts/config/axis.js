const xAxisConfig = {
  name: '',
  show: true,
  position: 'bottom',
  nameGap: 15,
  nameLocation: 'end',
  nameTextStyle: {
    fill: '#333',
    fontSize: 10
  },
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
      stroke: '#333',
      lineWidth: 1
    }
  },
  axisTick: {
    show: true,
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },
  axisLabel: {
    show: true,
    formatter: null,
    style: {
      fill: '#333',
      fontSize: 10
    }
  },
  splitLine: {
    show: false,
    style: {
      stroke: '#d4d4d4',
      lineWidth: 1
    }
  }
}

const yAxisConfig = {
  name: '',
  show: true,
  position: 'left',
  nameGap: 15,
  nameLocation: 'end',
  nameTextStyle: {
    fill: '#333',
    fontSize: 10
  },
  min: '20%',
  max: '20%',
  interval: null,
  minInterval: null,
  maxInterval: null,
  boundaryGap: false,
  splitNumber: 5,
  axisLine: {
    show: true,
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },
  axisTick: {
    show: true,
    style: {
      stroke: '#333',
      lineWidth: 1
    }
  },
  axisLabel: {
    show: true,
    formatter: null,
    style: {
      fill: '#333',
      fontSize: 10
    }
  },
  splitLine: {
    show: true,
    style: {
      stroke: '#d4d4d4',
      lineWidth: 1
    }
  }
}

export const axisConfig = {
  xAxisConfig,
  yAxisConfig
}