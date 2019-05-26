const option1 = {
    xAxis: {
        data: [
            '一月份', '二月份', '三月份', '四月份', '五月份', '六月份',
            '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份'
        ],
        axisLabel: {
            style: {
                rotate: 20,
                textAlign: 'left',
                textBaseline: 'top'
            }
        },
        axisTick: {
            show: false
        }
    },
    yAxis: [
        {
            name: '降雨量',
            data: 'value',
            min: 0,
            max: 300,
            interval: 50,
            splitLine: {
                style: {
                    lineDash: [3,3]
                }
            },
            axisLabel: {
                formatter: '{value} ml'
            },
            axisTick: {
                show: false
            }
        },
        {
            name: '气温',
            data: 'value',
            position: 'right',
            min: 0,
            max: 30,
            interval: 5,
            splitLine: {
                show: false
            },
            axisLabel: {
                formatter: '{value} °C',
            },
            axisTick: {
                show: false
            }
        }
    ],
    series: [
        {
            data: [
                175, 125, 90, 130, 45, 65,
                65, 47, 50, 52, 45, 37
            ],
            type: 'bar',
            gradient: {
                color: ['#247efc', '#ff2fdb']
            },
            animationCurve: 'easeOutBounce'
        },
        {
            data: [
                23, 18, 16, 14, 10, 8,
                6, 6, 6, 6, 6, 5
            ],
            type: 'line',
            yAxisIndex: 1,
            animationCurve: 'easeOutBounce'
        }
    ]
}

const option2 = {
    xAxis: {
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        data: 'value'
    },
    series: [
        {
            data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
            type: 'bar'
        }
    ]
}

export default [option1, option2]