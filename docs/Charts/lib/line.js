import { lineConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { deepMerge, mergeSameStackData } from '../util'

export function line (chart, option = {}) {
  const { xAxis, yAxis, series, color } = option

  if (!xAxis || !yAxis || !series) {
    removeLines(chart)

    return
  }

  if (!chart.line) chart.line = []

  let lines = series.filter(({ type }) => type === 'line')

  lines = calcLinesPosition(lines, chart)

  updateLines(lines, chart, color)
}

function removeLines (chart) {
  const { line, render } = chart

  if (!line) return

  line.forEach(l => render.delGraph(l))

  chart.line = null
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
    if (typeof v === 'number') {
      return (v - minValue) / valueMinus * valueAxisPosMinus + valueAxisStartPos
    } else {
      return null
    }
  })

  const { tickPosition } = labelAxis

  return position.map((vPos, i) => {
    if (typeof vPos === 'number') {
      const pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]]

      if (valueAxisPosIndex === 0) return pos

      pos.reverse()

      return pos
    } else {
      return null
    }
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
      updateLineFill(cache[0], lineItem, i)
      updateLine(cache[1], lineItem, i)

      return
    }

    addNewLine(lineItem, lineCache, i, color, render)
  })
}

function updateLineFill (graph, line, i) {

}

function mergeLineFillStyle (lineFillStyle, i, color, gradient) {

}

function updateLine (graph, line, i) {
  let { show, lineStyle, linePosition } = lineItem

  lineStyle = mergeLineColor(lineStyle, i)

  line.visible = show
  line.animation('shape', { points: linePosition }, true)
  line.animation('style', { ...lineStyle }, true)
}

function mergeLineColor (lineStyle, i, color) {
  const colorNum = color.length

  return {
    stroke: color[i % colorNum],
    ...lineStyle
  }
}

function addNewLine (line, lineCache, i, color, render) {
  let { show, lineStyle, linePosition, smooth } = line

  lineStyle = mergeLineColor(lineStyle, i, color)

  const graphName = smooth ? 'smoothline' : 'polyline'

  const lineGraph = render.add({
    name: graphName,
    visible: show,
    shape: {
      points: linePosition
    },
    style: lineStyle,
  })

  const { fill, lineFillBottomPos } = line

  let { show: fillShow, gradient, style: lineFillStyle } = fill

  lineFillStyle = mergeLineFillStyle(lineFillStyle, i, color, gradient)

  const lineFillGraph = render.add({
    name: graphName,
    visible: fillShow,
    lineFillBottomPos,
    shape: {
      points: linePosition
    },
    style: lineFillStyle,
    beforeDraw (foo, { ctx }) {
      ctx.strokeStyle = 'transparent'
    },
    drawed ({ lineFillBottomPos, shape }, { ctx }) {
      const { points } = shape

      const { changeIndex, changeValue } = lineFillBottomPos

      const linePoint1 = [...points[points.length - 1]]
      const linePoint2 = [...points[0]]

      linePoint1[changeIndex] = changeValue
      linePoint2[changeIndex] = changeValue

      ctx.lineTo(...linePoint1)
      ctx.lineTo(...linePoint2)

      console.warn(linePoint1, linePoint2)

      ctx.closePath()

      ctx.fillStyle = 'red'

      ctx.fill()
    }
  })

  console.error(lineFillGraph)

  lineCache[i] = [
    lineFillGraph,
    lineGraph
  ]
}

function calcPolylineLength (points) {

}