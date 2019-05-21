import { lineConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import bezierCurve from '@jiaminghi/bezier-curve'

import { getColorFromRgbValue, getRgbaValue } from '@jiaminghi/color'

import { deepMerge, mergeSameStackData, getTwoPointDistance, mulAdd, getLinearGradientColor } from '../util'

const { polylineToBezierCurve, getBezierCurveLength } = bezierCurve

export function line (chart, option = {}) {
  const { xAxis, yAxis, series, color } = option

  if (!xAxis || !yAxis || !series) removeLines(chart)

  initChartLine(chart)

  let lines = series.filter(({ type }) => type === 'line')

  lines = calcLinesPosition(lines, chart)

  updateLines(lines, chart, color)

  updatePoints(lines, chart, color)

  updateLabels(lines, chart, color)
}

function removeLines (chart) {
  const { line, render } = chart

  if (!line) return

  line.forEach(l => render.delGraph(l))

  chart.line = null
}

function initChartLine (chart) {
  if (!chart.line) chart.line = []
  if (!chart.linePoints) chart.linePoints = []
  if (!chart.lineLabels) chart.lineLabels = []
}

function calcLinesPosition (lines, chart) {
  const { axisData, grid } = chart

  return lines.map(lineItem => {
    lineItem = deepMerge(deepClone(lineConfig, true), lineItem)

    const lineData = mergeSameStackData(lineItem, lines)

    const lineAxis = getLineAxis(lineItem, axisData)

    const linePosition = getLinePosition(lineData, lineAxis, grid)

    const lineFillBottomPos = getLineFillBottomPos(lineAxis)

    return {
      ...lineItem,
      linePosition,
      lineFillBottomPos
    }
  })
}

function getLineAxis (line, axisData) {
  const { xAxisIndex, yAxisIndex } = line

  const xAxis = axisData.find(({ axis, index }) => axis === 'x' && index === xAxisIndex)
  const yAxis = axisData.find(({ axis, index }) => axis === 'y' && index === yAxisIndex)

  return [xAxis, yAxis]
}

function getLinePosition (lineData, lineAxis) {
  const valueAxisIndex = lineAxis.findIndex(({ data }) => data === 'value')

  const valueAxis = lineAxis[valueAxisIndex]
  const labelAxis = lineAxis[1 - valueAxisIndex]

  const { linePosition, axis } = valueAxis

  const valueAxisPosIndex = axis === 'x' ? 0 : 1

  const valueAxisStartPos = linePosition[0][valueAxisPosIndex]
  const valueAxisEndPos = linePosition[1][valueAxisPosIndex]
  const valueAxisPosMinus = valueAxisEndPos - valueAxisStartPos
  const { maxValue, minValue } = valueAxis
  const valueMinus = maxValue - minValue

  const position = lineData.map(v => {
    if (typeof v !== 'number') return null

    return (v - minValue) / valueMinus * valueAxisPosMinus + valueAxisStartPos
  })

  const { tickPosition } = labelAxis
  const tickNum = tickPosition.length

  return position.map((vPos, i) => {
    if (i >= tickNum || typeof vPos !== 'number') return null

    const pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]]

    if (valueAxisPosIndex === 0) return pos

    pos.reverse()

    return pos
  })
}

function getLineFillBottomPos (lineAxis) {
  const valueAxis = lineAxis.find(({ data }) => data === 'value')

  const { axis, linePosition } = valueAxis

  const changeIndex = axis === 'x' ? 0 : 1

  const changeValue = linePosition[0][changeIndex]

  return {
    changeIndex,
    changeValue
  }
}

function updateLines (lines, chart, color) {
  const { render, line: lineCache } = chart

  const cacheNum = lineCache.length
  const linesNum = lines.length

  if (cacheNum > linesNum) {
    const needDelLines = lineCache.splice(linesNum)

    needDelLines.forEach(item => item.forEach(g => render.delGraph(g)))
  }

  lines.forEach((lineItem, i) => {
    let { smooth } = lineItem

    const graphName = smooth ? 'smoothline' : 'polyline'

    let cache = lineCache[i]

    if (cache && cache[0].name !== graphName) {
      cache.forEach(g => render.delGraph(g))

      cache = null
    }

    if (cache) {
      changeLineFill(cache[0], lineItem, i, color)
      changeLine(cache[1], lineItem, i, color)
    } else {
      addNewLineFill(lineCache, lineItem, i, color, render, graphName)
      addNewLine(lineCache, lineItem, i, color, render, graphName)
    }
  })
}

function changeLineFill (graph, lineItem, i, color) {
  const { fill, lineFillBottomPos, linePosition, animationCurve, animationFrame } = lineItem

  let { show, gradient, style } = fill

  style = mergeLineFillStyle(style, i, color, gradient)

  graph.visible = show
  graph.animationCurve = animationCurve
  graph.animationFrame = animationFrame
  graph.lineFillBottomPos = lineFillBottomPos
  graph.animation('shape', { points: linePosition }, true)
  graph.animation('style', { ...style }, true)
}

function mergeLineFillStyle (lineFillStyle, i, color, gradient) {
  const colorNum = color.length

  lineFillStyle = deepMerge({ fill: color[i % colorNum] }, lineFillStyle)

  return {
    gradient: gradient.map(c => getRgbaValue(c)),
    ...lineFillStyle
  }
}

function changeLine (graph, lineItem, i, color) {
  let { show, lineStyle, linePosition, animationCurve, animationFrame } = lineItem

  lineStyle = mergeLineColor(lineStyle, i, color)

  graph.visible = show
  graph.animationCurve = animationCurve
  graph.animationFrame = animationFrame
  graph.animation('shape', { points: linePosition }, true)
  graph.animation('style', { ...lineStyle }, true)
}

function mergeLineColor (lineStyle, i, color) {
  const colorNum = color.length

  return deepMerge({ stroke: color[i % colorNum] }, lineStyle)
}

function addNewLine (lineCache, lineItem, i, color, render, graphName) {
  let { show, lineStyle, linePosition, smooth, animationCurve, animationFrame } = lineItem

  linePosition = linePosition.filter(p => p)

  lineStyle = mergeLineColor(lineStyle, i, color)

  const lineLength = getLineLength(linePosition, smooth)

  const { lineDash } = lineStyle
  
  const lineGraph = render.add({
    name: graphName,
    visible: show,
    animationCurve,
    animationFrame,
    shape: {
      points: linePosition
    },
    style: {
      ...lineStyle,
      lineDash: lineDash ? [0, 0] : [0, lineLength]
    }
  })

  lineGraph.animation('style', {
    lineDash: lineDash || [lineLength, 0]
  }, true)

  if (!(lineCache[i] instanceof Array)) lineCache[i] = []
  lineCache[i][1] = lineGraph
}

function addNewLineFill (lineCache, lineItem, i, color, render, graphName) {
  const { linePosition, fill, lineFillBottomPos, animationCurve, animationFrame } = lineItem

  let { show: fillShow, gradient, style: lineFillStyle } = fill

  lineFillStyle = mergeLineFillStyle(lineFillStyle, i, color, gradient)

  const { opacity, gradient: gradientColor } = lineFillStyle

  let startGradientColor = deepClone(gradientColor)
  startGradientColor.forEach(c => (c[3] = 0))

  const lineFillGraph = render.add({
    name: graphName,
    visible: fillShow,
    animationCurve,
    animationFrame,
    lineFillBottomPos,
    shape: {
      points: linePosition
    },
    style: {
      ...lineFillStyle,
      opacity: 0,
      gradient: startGradientColor
    },
    beforeDraw: lineFillBeforeDraw,
    drawed: lineFillDrawed
  })

  lineFillGraph.animation('style', {
    opacity,
    gradient: gradientColor
  }, true)

  if (!(lineCache[i] instanceof Array)) lineCache[i] = []
  lineCache[i][0] = lineFillGraph
}

function lineFillBeforeDraw ({ lineFillBottomPos, shape, style }, { ctx }) {
  const { max, min } = Math

  ctx.strokeStyle = 'transparent'

  const { changeIndex, changeValue } = lineFillBottomPos
  let { gradient } = style
  const { points } = shape

  if (!gradient.length) return

  gradient = gradient.map(v => getColorFromRgbValue(v))

  const mainPos = points.map(p => p[changeIndex])
  const maxPos = max(...mainPos)
  const minPos = min(...mainPos)

  let beginPos = maxPos
  if (changeIndex === 1) beginPos = minPos

  const begin = [beginPos, 0]
  const end = [changeValue, 0]

  if (changeIndex === 1) {
    begin.reverse()
    end.reverse()
  }

  ctx.fillStyle = getLinearGradientColor(ctx, begin, end, gradient)
}

function lineFillDrawed ({ lineFillBottomPos, shape }, { ctx }) {
  const { points } = shape

  const { changeIndex, changeValue } = lineFillBottomPos

  const linePoint1 = [...points[points.length - 1]]
  const linePoint2 = [...points[0]]

  linePoint1[changeIndex] = changeValue
  linePoint2[changeIndex] = changeValue

  ctx.lineTo(...linePoint1)
  ctx.lineTo(...linePoint2)

  ctx.closePath()

  ctx.fill()
}

function getLineLength (points, smooth = false) {
  if (!smooth) return getPolylineLength(points)

  const curve = polylineToBezierCurve(points)
  
  return getBezierCurveLength(curve)
}

function getPolylineLength (points) {
  const lineSegments = new Array(points.length - 1)
    .fill(0)
    .map((foo, i) => [points[i], points[i + 1]])

  const lengths = lineSegments.map(item => getTwoPointDistance(...item))

  return mulAdd(lengths)
}

function updatePoints (lines, chart, color) {
  const { render, linePoints: linePointsCache } = chart

  lines.forEach((lineItem, i) => {
    const cache = linePointsCache[i]

    if (cache) {
      changeLinePoints(cache, lineItem, i, render, color)
    } else {
      addNewLinePoints(linePointsCache, lineItem, i, render, color)
    }
  })
}

function changeLinePoints (cache, lineItem, i, render, color) {
  const { linePoint, linePosition, animationCurve, animationFrame } = lineItem

  let { show, radius, style } = linePoint

  style = mergePointColor(style, i, color)

  const pointsNum = linePosition.length
  const cacheNum = cache.length

  if (cacheNum > pointsNum) {
    cache.splice(pointsNum).forEach(g => render.delGraph(g))
  } else if (cacheNum < pointsNum) {
    const lastPointShape = cache[cacheNum - 1].shape

    const needAddGraphs = new Array(pointsNum - cacheNum)
      .fill(0)
      .map(foo => render.add({
        name: 'circle',
        visible: show,
        animationCurve,
        animationFrame,
        shape: lastPointShape,
        style
      }))

    cache.push(...needAddGraphs)
  }

  cache.forEach((g, i) => {
    g.visible = show
    g.animationCurve = animationCurve
    g.animationFrame = animationFrame
    g.animation('shape', {
      r: radius,
      rx: linePosition[i][0],
      ry: linePosition[i][1]
    }, true)
    g.animation('style', style, true)
  })
}

function addNewLinePoints (linePointsCache, lineItem, i, render, color) {
  const { linePoint, linePosition, animationCurve, animationFrame } = lineItem

  let { show, radius, style } = linePoint

  style = mergePointColor(style, i, color)

  linePointsCache[i] = linePosition.map(pos => render.add({
    name: 'circle',
    visible: show,
    animationCurve,
    animationFrame,
    shape: {
      r: 1,
      rx: pos[0],
      ry: pos[1]
    },
    style
  }))

  linePointsCache[i].forEach(g => {
    g.animation('shape', { r: radius }, true)
  })
}

function mergePointColor (style, i, color) {
  const colorNum = color.length
  
  style = deepMerge({ stroke: color[i % colorNum] }, style)

  return style
}

function updateLabels (lines, chart, color) {
  const { render, lineLabels: lineLabelsCache } = chart

  lines.forEach((lineItem, i) => {
    const cache = lineLabelsCache[i]

    if (cache) {
      changeLineLabels(cache, lineItem, i, color, render)
    } else {
      addNewLineLabels(lineLabelsCache, lineItem, i, color, render)
    }
  })
}

function changeLineLabels (cache, lineItem, i, color, render) {
  let { data, label, linePosition, lineFillBottomPos, animationCurve, animationFrame } = lineItem

  let { show, position, offset, style, formatter } = label

  data = formatterData (data, formatter)
  style = mergeLabelColor(style, i, color)
  const labelPosition = getLabelPosition(linePosition, lineFillBottomPos, position, offset)

  const labelsNum = linePosition.length
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

function addNewLineLabels (lineLabelsCache, lineItem, i, color, render) {
  let { data, label, linePosition, lineFillBottomPos, animationCurve, animationFrame } = lineItem

  let { show, position, offset, style, formatter } = label

  data = formatterData (data, formatter)

  style = mergeLabelColor(style, i, color)

  const labelPosition = getLabelPosition(linePosition, lineFillBottomPos, position, offset)

  lineLabelsCache[i] = labelPosition.map((pos, j) => render.add({
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

function mergeLabelColor (style, i, color) {
  const colorNum = color.length

  style = deepMerge({ fill: color[i % colorNum] }, style)

  return style
}

function getLabelPosition (linePosition, lineFillBottomPos, position, offset) {
  const { changeIndex, changeValue } = lineFillBottomPos

  return linePosition.map(pos => {
    if (position === 'bottom') {
      pos = [...pos]
      pos[changeIndex] = changeValue
    }

    if (position === 'center') {
      const bottom = [...pos]
      bottom[changeIndex] = changeValue

      pos = getCenterLabelPoint(pos, bottom)
    }

    return getOffsetedPoint(pos, offset)
  })
}

function getOffsetedPoint ([x, y], [ox, oy]) {
  return [x + ox, y + oy]
}

function getCenterLabelPoint([ax, ay], [bx, by]) {
  return [
    (ax + bx) / 2,
    (ay + by) / 2
  ]
}