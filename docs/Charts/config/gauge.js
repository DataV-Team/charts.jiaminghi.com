export const gaugeConfig = {
    show: true,
    center: ['50%', '50%'],
    radius: '60%',
    startAngle: -(Math.PI / 4) * 5,
    endAngle: Math.PI / 4,
    min: 0,
    max: 100,
    splitNum: 6,
    arcLineWidth: 10,
    label: {
        show: true,
        data: [],
        formatter: null,
        style: {}
    },
    axisTick: {
        show: true,
        style: {}
    },
    details: {
        show: true,
        formatter: null,
        offset: [0, 0],
        position: 'center',
        style: {}
    },
    backgroundArc: {
        show: true,
        style: {
            stroke: '#999'
        }
    }
}