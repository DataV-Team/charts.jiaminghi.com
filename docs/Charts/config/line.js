export const lineConfig = {
  show: true,
  smooth: false,
  xAxisIndex: 0,
  yAxisIndex: 0,
  lineStyle: {
    lineWidth: 1
  },
  linePoint: {
    show: true,
    radius: 2,
    style: {
      fill: '#fff',
      lineWidth: 1
    }
  },
  lineArea: {
    show: false,
    gradient: [],
    style: {
      opacity: 0.5
    }
  },
  label: {
    show: false,
    position: 'top',
    offset: [0, -10],
    formatter: null,
    style: {
      fontSize: 10
    }
  },
  animationCurve: 'easeOutCubic',
  animationFrame: 50
}