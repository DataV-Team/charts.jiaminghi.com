import { barConfig, axisConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { deepMerge, mergeSameStackData, getTwoPointDistance, mulAdd, getLinearGradientColor } from '../util'

export function bar (chart, option = {}) {
  const { xAxis, yAxis, series, color } = option

  if (!xAxis || !yAxis || !series) removeBars(chart)

  initChartBar(chart)

  let bars = series.filter(({ type }) => type === 'bar')

  bars = mergeBarDefaultConfig(bars)

  bars = filterShowBars(bars)

  bars = setBarAxis(bars, chart)

  bars = setBarPositionData(bars, chart)

  console.error(bars)

  bars = calcBarsPosition(bars, chart)
}

function removeBars (chart) {
  const { bar, render } = chart

  if (!bar) return

  bar.forEach(l => render.delGraph(l))

  chart.bar = null
}

function initChartBar (chart) {
  if (!chart.bar) chart.bar = []
}

function mergeBarDefaultConfig (bars) {
  return bars.map(barItem => deepMerge(deepClone(barConfig, true), barItem))
}

function filterShowBars (bars) {
  return bars.filter(({ show }) => show === true)
}

function setBarAxis (bars, chart) {
  const { axisData } = chart

  bars.forEach(bar => {
    let { xAxisIndex, yAxisIndex } = bar

    if (typeof xAxisIndex !== 'number') xAxisIndex = 0
    if (typeof yAxisIndex !== 'number') yAxisIndex = 0

    const xAxis = axisData.find(({ axis, index }) => `${axis}${index}` === `x${xAxisIndex}`)
    const yAxis = axisData.find(({ axis, index }) => `${axis}${index}` === `y${yAxisIndex}`)

    const axis = [xAxis, yAxis]

    const valueAxisIndex = axis.findIndex(({ data }) => data === 'value')

    bar.valueAxis = axis[valueAxisIndex]
    bar.labelAxis = axis[1 - valueAxisIndex]
  })

  return bars
}

function setBarPositionData (bars, chart) {
  const labelBarGroup = groupBarByLabelAxis(bars)

  labelBarGroup.forEach(group => {
    setBarIndex(group)
    setBarCategoryWidth(group, chart)
    setBarGap(group)
  })

  return bars
}

function setBarIndex (bars) {
  let stacks = getBarStack(bars)
  
  stacks = stacks.map(stack => ({ stack, index: -1 }))

  let currentIndex = 0

  bars.forEach(bar => {
    const { stack } = bar

    if (!stack) {
      bar.barIndex = currentIndex

      currentIndex++
    } else {
      const stackData = stacks.find(({ stack:s }) => s === stack)

      if (stackData.index === -1) {
        stackData.index = currentIndex

        currentIndex++
      }

      bar.barIndex = stackData.index
    }
  })
}

function groupBarByLabelAxis (bars) {
  let labelAxis = bars.map(({ labelAxis: { axis, index } }) => (axis + index))

  labelAxis = [...new Set(labelAxis)]

  return labelAxis.map(axisIndex => {
    return bars.filter(({ labelAxis: { axis, index } }) => (axis + index) === axisIndex)
  })
}

function getBarStack (bars) {
  const stacks = []

  bars.forEach(({ stack }) => {
    if (stack) stacks.push(stack)
  })

  return [...new Set(stacks)]
}

function setBarCategoryWidth (bars) {
  const lastBar = bars.slice(-1)[0]

  const { barCategoryGap, labelAxis: { tickGap } } = lastBar

  let barCategoryWidth = 0

  if (typeof barCategoryGap === 'number') {
    barCategoryWidth = barCategoryGap
  } else {
    barCategoryWidth = (1 - (parseInt(barCategoryGap) / 100)) * tickGap 
  }

  bars.forEach(bar => (bar.barCategoryWidth = barCategoryWidth))
}

function setBarGap (bars) {
  const lastBar = bars.slice(-1)[0]

  const { barGap, barCategoryWidth } = lastBar

  
}

function getBarPositionData (bars, chart) {
  // const barNum = getBarNum(bars)

  // const barsItemWidth = getBarsItemWidth(bars, chart)
}

function getBarNum (bars) {
  const indexs = bars.map(({ barIndex }) => barIndex)

  return [...new Set(indexs)].length
}

function getBarsItemWidth(bars, chart) {
  // const { barCategoryGap } = bars.slice(-1)[0]

  // console.warn(barCategoryGap)
}

function calcBarsPosition (bars, chart) {
  // console.warn(bars)
}