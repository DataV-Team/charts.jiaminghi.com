import { colorConfig } from '../config'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { deepMerge } from '../util'

export function mergeColor (chart, option = {}) {
  const defaultColor = deepClone(colorConfig, true)

  let { color } = option

  if (!color) color = []

  option.color = deepMerge(defaultColor, color)
}
