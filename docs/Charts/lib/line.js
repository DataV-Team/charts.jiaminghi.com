import { deepClone } from '@jiaminghi/c-render/lib/util'

import { lineConfig } from '../config'

import { deepMerge } from '../util'

export function line (chart, option = {}) {
  const { xAxis, yAxis, series } = option

  if (!xAxis || !yAxis || !series) {
    removeLines(chart)

    return
  }

  if (!chart.line) chart.line = []

  let lines = series.filter(({ type }) => type === 'line')

  lines = calcLinesPosition(lines, chart)
}

function removeLines (chart) {
  const { line, render } = chart

  if (!line) return

  line.forEach(l => render.delGraph(l))

  chart.line = null
}

function calcLinesPosition (lines, chart) {
  
  lines.map(line => {
    line = deepMerge(deepClone(lineConfig, true), line)

    console.log(line)
  })
}
