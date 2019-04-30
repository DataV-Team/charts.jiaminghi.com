import CRender from '@jiaminghi/c-render'

import { grid, axis } from '../lib'

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
      option: null,
      grid: null,
      axis: null
    }

    Object.assign(this, attribute)
  }
}

Charts.prototype.setOption = function (option) {
  if (!option || typeof option !== 'object') {
    console.error('setOption Missing parameters!')

    return false
  }

  grid(this, option)

  axis(this, option)

  this.render.launchAnimation()
}