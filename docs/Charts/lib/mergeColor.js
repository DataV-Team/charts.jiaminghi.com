import { colorConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { deepMerge } from '../util'

export function mergeColor (chart, option = {}) {
  const defaultColor = deepClone(colorConfig, true)

  let { color, series } = option

  if (!color) color = []

  option.color = color = deepMerge(defaultColor, color)

  if (!series.length) return

  const colorNum = color.length

  series.forEach((item, i) => (item.color = color[i % colorNum]))
}
