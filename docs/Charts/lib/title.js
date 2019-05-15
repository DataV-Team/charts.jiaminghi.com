import { deepClone } from '@jiaminghi/c-render/lib/util'

import { titleConfig } from '../config'

import { deepMerge } from '../util'

export function title (chart, option = {}) {
  let { title } = option

  if (!title) {
    removeTitle(chart)

    return
  }

  title = deepMerge(deepClone(titleConfig, true), title)

  const { show, text, offset, textStyle } = title

  const { render, grid } = chart

  const [ox, oy] = offset

  const { x, y, w } = grid.area

  const position = [x + (w / 2) + ox, y + oy]

  const titleCache = chart.title

  if (titleCache) {
    titleCache.visible = show
    titleCache.shape.content = text
    titleCache.animation('shape', { position }, true)
    titleCache.animation('style', { ...textStyle }, true)

    return
  }

  chart.title = render.add({
    name: 'text',
    animationCurve: 'easeOutCubic',
    visible: show,
    shape: {
      content: text,
      position
    },
    style: {
      ...textStyle
    }
  })
}

function removeTitle (chart) {
  const { title, render } = chart

  if (!title) return

  render.delGraph(title)

  chart.title = null
}