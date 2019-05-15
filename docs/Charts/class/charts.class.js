import CRender from '@jiaminghi/c-render'

import { deepClone } from '@jiaminghi/c-render/lib/util'

import { grid, axis, title } from '../lib'

import { line } from '../lib'

export default class Charts {
  constructor (dom) {
    if (!dom) {
      console.error('Charts Missing parameters!')

      return false
    }

    const { clientWidth, clientHeight } = dom

    const canvas = document.createElement('canvas')

    canvas.setAttribute('width', clientWidth)
    canvas.setAttribute('height', clientHeight)

    dom.appendChild(canvas)

    const attribute = {
      container: dom,
      render: new CRender(canvas),
      option: null
    }

    Object.assign(this, attribute)
  }
}

Charts.prototype.setOption = function (option) {
  if (!option || typeof option !== 'object') {
    console.error('setOption Missing parameters!')

    return false
  }

  option = deepClone(option, true)  

  grid(this, option)

  axis(this, option)

  title(this, option)

  line(this, option)

  this.option = option

  this.render.launchAnimation()
}