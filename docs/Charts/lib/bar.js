import { barConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { getColorFromRgbValue, getRgbaValue } from '@jiaminghi/color'

import { deepMerge, mergeSameStackData, getLinearGradientColor } from '../util'

export function bar (chart, option = {}) {
  const { xAxis, yAxis, series, color } = option

  if (!xAxis || !yAxis || !series) removeBars(chart)

  initChartBar(chart)

  let bars = series.filter(({ type }) => type === 'bar')

  bars = mergeBarDefaultConfig(bars)

  bars = filterShowBars(bars)

  bars = setBarAxis(bars, chart)

  bars = setBarPositionData(bars, chart)

  bars = calcBarsPosition(bars, chart)

  bars.reverse()

  updateBars(bars, chart, color)

  updateBarLabels(bars, chart, color)
}

function removeBars (chart) {
  const { bar, render } = chart

  if (!bar) return

  bar.forEach(l => render.delGraph(l))

  chart.bar = null
}

function initChartBar (chart) {
  if (!chart.bar) chart.bar = []
  if (!chart.barLabels) chart.barLabels = []
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
    setBarNum(group)
    setBarCategoryWidth(group, chart)
    setBarWidthAndGap(group)
    setBarAllWidthAndGap(group)
    setBarColorIndex(group)
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

function setBarNum (bars) {
  const barNum = [...new Set(bars.map(({ barIndex}) => barIndex))].length

  bars.forEach(bar => (bar.barNum = barNum))
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

function setBarWidthAndGap (bars) {
  const { barCategoryWidth, barWidth, barGap, barNum } = bars.slice(-1)[0]

  let widthAndGap = []

  if (typeof barWidth === 'number' || barWidth !== 'auto') {
    widthAndGap = getBarWidthAndGapWithPercentOrNumber(barCategoryWidth, barWidth, barGap, barNum)
  } else if (barWidth === 'auto') {
    widthAndGap = getBarWidthAndGapWidthAuto(barCategoryWidth, barWidth, barGap, barNum)
  }

  const [width, gap] = widthAndGap

  bars.forEach(bar => {
    bar.barWidth = width
    bar.barGap = gap
  })
}

function getBarWidthAndGapWithPercentOrNumber (barCategoryWidth, barWidth, barGap) {
  let [width, gap] = [0, 0]

  if (typeof barWidth === 'number') {
    width = barWidth
  } else {
    width = parseInt(barWidth) / 100 * barCategoryWidth
  }

  if (typeof barGap === 'number') {
    gap = barGap
  } else {
    gap = parseInt(barGap) / 100 * width
  }

  return [width, gap]
}

function getBarWidthAndGapWidthAuto (barCategoryWidth, barWidth, barGap, barNum) {
  let [width, gap] = [0, 0]

  const barItemWidth = barCategoryWidth / barNum

  if (typeof barGap === 'number') {
    gap = barGap
    width = barItemWidth - gap
  } else {
    const percent = 10 + parseInt(barGap) / 10

    if (percent === 0) {
      width = barItemWidth * 2
      gap = -width
    } else {
      width = barItemWidth / percent * 10
      gap = barItemWidth - width
    }
  }

  return [width, gap]
}

function setBarAllWidthAndGap (bars) {
  const { barGap, barWidth, barNum } = bars.slice(-1)[0]

  const barAllWidthAndGap = (barGap + barWidth) * barNum - barGap

  bars.forEach(bar => (bar.barAllWidthAndGap = barAllWidthAndGap))
}

function setBarColorIndex (bars) {
  bars.forEach((bar, i) => (bar.colorIndex = i))
}

function calcBarsPosition (bars, chart) {
  bars = calcBarLabelAxisCoordinate(bars)
  bars = calcBarValueAxisCoordinate(bars)

  return bars
}

function calcBarLabelAxisCoordinate (bars) {
  return bars.map(bar => {
    const { labelAxis, barAllWidthAndGap, barGap, barWidth, barIndex } = bar

    const { tickGap, tickPosition, axis } = labelAxis

    const coordinateIndex = axis === 'x' ? 0 : 1

    const barLabelAxisPos = tickPosition.map((tick, i) => {
      const barCategoryStartPos = tickPosition[i][coordinateIndex] - tickGap / 2

      const barItemsStartPos = barCategoryStartPos + (tickGap - barAllWidthAndGap) / 2

      return barItemsStartPos + (barIndex + 0.5) * barWidth + barIndex * barGap
    })

    return {
      ...bar,
      barLabelAxisPos
    }
  })
}

function calcBarValueAxisCoordinate (bars) {
  return bars.map(bar => {
    const data = mergeSameStackData(bar, bars)

    const { axis, minValue, maxValue, linePosition } = bar.valueAxis

    const startPos = getValuePos(
      minValue,
      maxValue,
      minValue < 0 ? 0 : minValue,
      linePosition,
      axis
    )

    const endPos = data.map(v => getValuePos(
      minValue,
      maxValue,
      v,
      linePosition,
      axis
    ))

    const barValueAxisPos = endPos.map(p => ([startPos, p]))

    return {
      ...bar,
      barValueAxisPos
    }
  })
}

function getValuePos (min, max, value, linePosition, axis) {
  const valueMinus = max - min

  const coordinateIndex = axis === 'x' ? 0 : 1

  const posMinus = linePosition[1][coordinateIndex] - linePosition[0][coordinateIndex]

  const pos = (value - min) / valueMinus * posMinus

  return pos + linePosition[0][coordinateIndex]
}

function updateBars (bars, chart, color) {
  const { render, bar: barCache } = chart

  const cacheNum = barCache.length
  const barsNum = bars.length

  if (cacheNum > barsNum) {
    const needDelBars = barCache.splice(barsNum)

    needDelBars.forEach(item => item.forEach(g => render.delGraph(g)))
  }

  bars.forEach((barItem, i) => {
    const { shapeType } = barItem

    let cache = barCache[i]

    if (cache && cache[0].shapeType !== shapeType) {
      cache.forEach(g => render.delGraph(g))

      cache = null
    }

    if (cache) {
      changeBars(cache, barItem, i, color, render)
    } else {
      addNewBars(barCache, barItem, i, color, render)
    }
  })
}

function changeBars (cache, barItem, i, color, render) {
  const { shapeType } = barItem

  if (shapeType === 'leftEchelon' || shapeType === 'rightEchelon') {
    changeEchelonBar(cache, barItem, render, color)
  } else {
    changeNormalBar(cache, barItem, render, color)
  }
}

function changeEchelonBar (cache, barItem, render, color) {
  const { animationCurve, animationFrame } = barItem

  const style = mergeColorAndGradient(barItem, color)

  cache.forEach((graph, i) => {
    const { points } = getEchelonBarShape(barItem, i)

    const gradientPos = getGradientPos(barItem, i)

    const pointsNum = points.length
    const cacheGraphPointsNum = graph.shape.points.length

    if (pointsNum > cacheGraphPointsNum) {
      graph.shape.points[3] = graph.shape.points[2]
    } else if (pointsNum < cacheGraphPointsNum) {
      graph.shape.points.splice(-1)
    }

    graph.animationCurve = animationCurve
    graph.animationFrame = animationFrame
    graph.animation('shape', { points }, true)
    graph.animation('style', {
      ...style,
      gradientPos
    }, true)
  })
}

function changeNormalBar (cache, barItem, render, color) {
  const { animationCurve, animationFrame } = barItem

  const style = mergeColorAndGradient(barItem, color)

  cache.forEach((graph, i) => {
    const shape = getNormalBarShape(barItem, j)

    const gradientPos = getGradientPos(barItem, j)

    graph.animationCurve = animationCurve
    graph.animationFrame = animationFrame
    graph.animation('shape', shape, true)
    graph.animation('style', {
      ...style,
      gradientPos
    }, true)
  })
}

function addNewBars (barCache, barItem, i, color, render) {
  const { shapeType } = barItem

  const graphs = []

  if (shapeType === 'leftEchelon' || shapeType === 'rightEchelon') {
    graphs.push(...addEchelonBar(barItem, render, color))
  } else {
    graphs.push(...addNewNormalBar(barItem, render, color))
  }

  barCache[i] = graphs
}

function addEchelonBar(barItem, render, color) {
  const { shapeType, animationCurve, animationFrame } = barItem

  const graphNum = barItem.labelAxis.tickPosition.length

  const style = mergeColorAndGradient(barItem, color)

  return new Array(graphNum).fill(0).map((foo, j) => {
    const shape = getEchelonBarShape(barItem, j)

    const gradientPos = getGradientPos(barItem, j)

    const startShape = getEchelonBarStartShape(shape, barItem)

    const graph = render.add({
      name: 'polyline',
      shapeType,
      animationCurve,
      animationFrame,
      shape: startShape,
      style: {
        ...style,
        gradientPos
      },
      beforeDraw: barBeforeDraw
    })

    graph.animation('shape', shape, true)

    return graph
  })
}

function getEchelonBarShape (barItem, i) {
  const { shapeType } = barItem

  if (shapeType === 'leftEchelon') return getLeftEchelonShape (barItem, i)
  if (shapeType === 'rightEchelon') return getRightEchelonShape (barItem, i)
}

function getLeftEchelonShape (barItem, i) {
  const { barValueAxisPos, barLabelAxisPos, barWidth, echelonOffset } = barItem

  const [start, end] = barValueAxisPos[i]
  const labelAxisPos = barLabelAxisPos[i]
  const halfWidth = barWidth / 2

  const valueAxis = barItem.valueAxis.axis

  const points = []

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos - halfWidth]
    points[1] = [end, labelAxisPos + halfWidth]
    points[2] = [start, labelAxisPos + halfWidth]
    points[3] = [start + echelonOffset, labelAxisPos - halfWidth]

    if (end - start < echelonOffset) points.splice(3, 1)
  } else {
    points[0] = [labelAxisPos - halfWidth, end]
    points[1] = [labelAxisPos + halfWidth, end]
    points[2] = [labelAxisPos + halfWidth, start]
    points[3] = [labelAxisPos - halfWidth, start - echelonOffset]

    if (start - end < echelonOffset) points.splice(3, 1)
  }

  return { points, close: true }
}

function getRightEchelonShape (barItem, i) {
  const { barValueAxisPos, barLabelAxisPos, barWidth, echelonOffset } = barItem

  const [start, end] = barValueAxisPos[i]
  const labelAxisPos = barLabelAxisPos[i]
  const halfWidth = barWidth / 2

  const valueAxis = barItem.valueAxis.axis

  const points = []

  if (valueAxis === 'x') {
    points[0] = [end, labelAxisPos + halfWidth]
    points[1] = [end, labelAxisPos - halfWidth]
    points[2] = [start, labelAxisPos - halfWidth]
    points[3] = [start + echelonOffset, labelAxisPos + halfWidth]

    if (end - start < echelonOffset) points.splice(2, 1)
  } else {
    points[0] = [labelAxisPos + halfWidth, end]
    points[1] = [labelAxisPos - halfWidth, end]
    points[2] = [labelAxisPos - halfWidth, start]
    points[3] = [labelAxisPos + halfWidth, start - echelonOffset]

    if (start - end < echelonOffset) points.splice(2, 1)
  }

  return { points, close: true }
}

function getEchelonBarStartShape (shape, barItem) {
  const { shapeType } = barItem

  if (shapeType === 'leftEchelon') return getLeftEchelonShapeBarStartShape (shape, barItem)
  if (shapeType === 'rightEchelon') return getRightEchelonShapeBarStartShape (shape, barItem)
}

function getLeftEchelonShapeBarStartShape (shape, barItem) {
  const axis = barItem.valueAxis.axis

  shape = deepClone(shape)

  const { points } = shape

  const index = axis === 'x' ? 0 : 1

  const start = points[2][index]

  points.forEach(point => (point[index] = start))

  return shape
}

function getRightEchelonShapeBarStartShape (shape, barItem) {
  const axis = barItem.valueAxis.axis

  shape = deepClone(shape)

  const { points } = shape

  const index = axis === 'x' ? 0 : 1

  const start = points[2][index]

  points.forEach(point => (point[index] = start))

  return shape
}

function addNewNormalBar(barItem, render, color) {
  const { shapeType, animationCurve, animationFrame } = barItem

  const graphNum = barItem.labelAxis.tickPosition.length

  const style = mergeColorAndGradient(barItem, color)

  return new Array(graphNum).fill(0).map((foo, j) => {
    const shape = getNormalBarShape(barItem, j)

    const gradientPos = getGradientPos(barItem, j)

    const startShape = getNormalBarStartShape(shape, barItem)

    const graph = render.add({
      name: 'rect',
      shapeType,
      animationCurve,
      animationFrame,
      shape: startShape,
      style: {
        ...style,
        gradientPos
      },
      beforeDraw: barBeforeDraw
    })

    graph.animation('shape', shape, true)

    return graph
  })
}

function getNormalBarShape (barItem, i) {
  const { barValueAxisPos, barLabelAxisPos, barWidth } = barItem

  const [start, end] = barValueAxisPos[i]
  const labelAxisPos = barLabelAxisPos[i]

  const valueAxis = barItem.valueAxis.axis

  const shape = {}

  if (valueAxis === 'x') {
    shape.x = start
    shape.y = labelAxisPos - barWidth / 2
    shape.w = end - start
    shape.h = barWidth
  } else {
    shape.x = labelAxisPos - barWidth / 2
    shape.y = end
    shape.w = barWidth
    shape.h = start - end
  }

  return shape
}

function mergeColorAndGradient (barItem, color) {
  const { barStyle, gradient, colorIndex } = barItem

  const colorNum = color.length

  let style = deepMerge({ fill: color[colorIndex % colorNum] }, barStyle)

  style = {
    ...style,
    gradient: gradient.color.map(c => getRgbaValue(c))
  }

  return style
}

function getGradientPos (barItem, i) {
  const { barValueAxisPos, barLabelAxisPos, data } = barItem

  const { linePosition, axis } = barItem.valueAxis

  const [start, end] = barValueAxisPos[i]
  const labelAxisPos = barLabelAxisPos[i]
  const value = data[i]

  const [lineStart, lineEnd] = linePosition

  const valueAxisIndex = axis === 'x' ? 0 : 1

  let endPos = end

  if (!barItem.gradient.local) {
    endPos = value < 0 ? linelineStartEnd[valueAxisIndex] : lineEnd[valueAxisIndex]
  }

  const position = [[endPos, labelAxisPos], [start, labelAxisPos]]

  if (axis === 'y') position.forEach(p => p.reverse())

  return position
}

function getNormalBarStartShape(shape, barItem) {
  const axis = barItem.valueAxis.axis

  let { x, y, w, h } = shape

  if (axis === 'x') {
    w = 0
  } else {
    y = y + h
    h = 0
  }

  return { x, y, w, h }
}

function barBeforeDraw ({ style }, { ctx }) {
  const { gradient, gradientPos } = style

  if (!gradient.length) return

  const [begin, end] = gradientPos

  const color = gradient.map(cv => getColorFromRgbValue(cv))

  ctx.fillStyle = getLinearGradientColor(ctx, begin, end, color)
}

function updateBarLabels(bars, chart, color) {
  const { render, barLabels: barLabelsCache } = chart

  bars.forEach((barItem, i) => {
    const cache = barLabelsCache[i]

    if (cache) {
      changeBarLabels(cache, barItem, i, color, render)
    } else {
      addNewBarLabels(barLabelsCache, barItem, i, color, render)
    }
  })
}

function changeBarLabels (cache, barItem, i, color, render) {
  let { data, label, barLabelAxisPos, animationCurve, animationFrame } = barItem

  let { show, style, formatter } = label

  data = formatterData (data, formatter)
  style = mergeLabelColor(style, barItem, color)
  const labelPosition = getLabelPosition(barItem)

  const labelsNum = barLabelAxisPos.length
  const cacheNum = cache.length

  if (cacheNum > labelsNum) {
    cache.splice(labelsNum).forEach(g => render.delGraph(g))
  } else if (cacheNum < labelsNum) {
    const lastLabelShape = cache[cacheNum - 1].shape

    const needAddGraphs = new Array(labelsNum - cacheNum)
      .fill(0)
      .map(foo => render.add({
        name: 'text',
        visible: show,
        animationCurve,
        animationFrame,
        shape: lastLabelShape,
        style
      }))

    cache.push(...needAddGraphs)
  }

  cache.forEach((g, j) => {
    g.visible = show
    g.animationCurve = animationCurve
    g.animationFrame = animationFrame
    g.animation('shape', {
      content: data[j],
      position: labelPosition[j]
    }, true)
    g.animation('style', style, true)
  })
}

function addNewBarLabels (barLabelsCache, barItem, i, color, render) {
  let { data, label, animationCurve, animationFrame } = barItem

  let { show, style, formatter } = label

  data = formatterData (data, formatter)

  style = mergeLabelColor(style, barItem, color)

  const labelPosition = getLabelPosition(barItem)

  barLabelsCache[i] = labelPosition.map((pos, j) => render.add({
    name: 'text',
    visible: show,
    animationCurve,
    animationFrame,
    shape: {
      content: data[j],
      position: pos
    },
    style
  }))
}

function formatterData (data, formatter) {
  data = data.map(d => d.toString())

  if (!formatter) return data

  const type = typeof formatter

  if (type === 'string') return data.map(d => formatter.replace('{value}', d))

  if (type === 'function') return data.map(d => formatter(d))

  return data
}

function mergeLabelColor (style, barItem, color) {
  const { colorIndex, gradient: { color: gc } } = barItem

  const colorNum = color.length
  
  let fillColor = color[colorIndex % colorNum]

  if (gc.length) fillColor = gc[0]

  style = deepMerge({ fill: fillColor }, style)

  return style
}

function getLabelPosition (barItem) {
  const { label, barValueAxisPos, barLabelAxisPos } = barItem

  const { position, offset } = label

  const axis = barItem.valueAxis.axis

  return barValueAxisPos.map(([start, end], i) => {
    const labelAxisPos = barLabelAxisPos[i]
    let pos = [end, labelAxisPos]

    if (position === 'bottom') {
      pos = [start, labelAxisPos]
    }

    if (position === 'center') {
      pos = [(start + end) / 2, labelAxisPos]
    }

    if (axis === 'y') pos.reverse()

    return getOffsetedPoint(pos, offset)
  })
}

function getOffsetedPoint ([x, y], [ox, oy]) {
  return [x + ox, y + oy]
}