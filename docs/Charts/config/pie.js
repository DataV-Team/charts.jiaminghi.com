export const pieConfig = {
  show: true,
  radius: '50%',
  center: ['50%', '50%'],
  startAngle: -Math.PI / 2,
  roseType: false,
  roseIncrement: '15%',
  insideLabel: {
    show: false,
    formatter: null,
    offset: [0, 0],
    style: {
      fontSize: 10,
      fill: '#fff'
    }
  },
  outsideLable: {
    show: true,
    formatter: null,
    offset: [0, 0],
    style: {
      fontSize: 10,
    }
  },
  pieStyle: {
    shadowColor: '#888',
    shadowBlur: 5
  },
  percentToFixed: 0,
  animationCurve: 'easeOutBack',
  animationFrame: 50
}