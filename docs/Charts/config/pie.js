export const pieConfig = {
  show: true,
  radius: '50%',
  center: ['50%', '50%'],
  startAngle: -Math.PI / 2,
  roseType: false,
  roseIncrement: '15%',
  label: {
    show: false,
    position: 'outsides',
    offset: [0, -10],
    formatter: null,
    style: {
      fontSize: 10
    }
  },
  pieStyle: {
    shadowColor: '#888',
    shadowBlur: 5
  },
  percentToFixed: 0,
  animationCurve: 'easeOutCubic',
  animationFrame: 50
}