import { deepClone } from '@jiaminghi/c-render/lib/util'

import { gridConfig } from '../config'

export function grid (chart, option = {}) {
  const config = deepClone(gridConfig)

  let { grid } = option

  if (!grid) grid = {}

  Object.assign(config, grid)

  const { render } = chart

  const { area: [w, h] } = render

  const left = getNumberValue(config.left, w)
  const right = getNumberValue(config.right, w)
  const top = getNumberValue(config.top, h)
  const bottom = getNumberValue(config.bottom, h)
  const backgroundColor = config.backgroundColor

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