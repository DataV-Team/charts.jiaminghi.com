import { deepClone } from '@jiaminghi/c-render/lib/util'

import { gridConfig } from '../config'

import { deepMerge } from '../util'

export function grid (chart, option = {}) {
  let { grid } = option

  grid = deepMerge(deepClone(gridConfig, true), grid || {})

  const { render } = chart

  const { area: [w, h] } = render

  const left = getNumberValue(grid.left, w)
  const right = getNumberValue(grid.right, w)
  const top = getNumberValue(grid.top, h)
  const bottom = getNumberValue(grid.bottom, h)
  const backgroundColor = grid.backgroundColor

  const width = w - left - right
  const height = h - top - bottom

  const shape = {
    x: left,
    y: top,
    w: width,
    h: height
  }

  if (chart.grid) {
    const { graph } = chart.grid

    graph.animation('shape', shape, true)

    graph.animation('style', { fill: backgroundColor }, true)

    chart.grid.area = { ...shape }

    return
  }

  const graph = render.add({
    name: 'rect',
    animationCurve: 'linear',
    shape,
    style: { fill: backgroundColor }
  })

  chart.grid = {
    graph,
    area: {
      ...shape
    }
  }
}

function getNumberValue (val, all) {
  if (typeof val === 'number') return val

  if (typeof val !== 'string') return 0

  return all * parseInt(val) / 100
}