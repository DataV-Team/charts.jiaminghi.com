import { gaugeConfig } from '../config/gauge'

import { deepClone, getCircleRadianPoint } from '@jiaminghi/c-render/lib/util'

import { deepMerge } from '../util'

export function gauge (chart, option = {}) {
  const { series } = option

  if (!series) return removeGauges(chart)
  
  initChartGauge(chart)

  let gauges = series.filter(({ type }) => type === 'gauge')

  if (!gauges.length) return removeGauges(chart)

  gauges = mergeGaugeDefaultConfig(gauges)

  gauges = filterShowGauges(gauges)

  gauges = calcGaugesCenter(gauges, chart)

  gauges = calcGaugesRadius(gauges, chart)

  gauges = calcGaugesDataRadiusAndLineWidth(gauges, chart)

  gauges = calcGaugesDataAngles(gauges, chart)

  gauges = calcGaugesDataGradient(gauges, chart)

  console.warn(gauges)
}

function removeGauge (chart) {

}

function initChartGauge (chart) {
  const { gaugeBackgroundArc, gaugeArc } = chart

  if (!gaugeBackgroundArc) chart.gaugeBackgroundArc = null
  if (!gaugeArc) chart.gaugeArc = []
}

function mergeGaugeDefaultConfig (gauges) {
  return gauges.map(gaugeItem => deepMerge(deepClone(gaugeConfig, true), gaugeItem))
}

function filterShowGauges (gauges) {
  return gauges.filter(({ show }) => show)
}

function calcGaugesCenter (gauges, chart) {
  const { area } = chart.render

  gauges.forEach(gaugeItem => {
    let { center } = gaugeItem

    center = center.map((pos, i) => {
      if (typeof pos === 'number') return pos

      return parseInt(pos) / 100 * area[i]
    })

    gaugeItem.center = center
  })

  return gauges
}

function calcGaugesRadius (gauges, chart) {
  const { area } = chart.render

  const maxRadius = Math.min(...area)

  gauges.forEach(gaugeItem => {
    let { radius } = gaugeItem

    if (typeof radius !== 'number') {
      radius = parseInt(radius) / 100 * maxRadius
    }

    gaugeItem.radius = radius
  })

  return gauges
}

function calcGaugesDataRadiusAndLineWidth (gauges, chart) {
  const { area } = chart.render

  const maxRadius = Math.min(...area)

  gauges.forEach(gaugeItem => {
    const { radius, data, arcLineWidth } = gaugeItem

    data.forEach(item => {
      let { radius: arcRadius, lineWidth } = item

      if (!arcRadius) arcRadius = radius

      if (typeof arcRadius !== 'number') arcRadius = parseInt(arcRadius) / 100 * maxRadius

      item.radius = arcRadius

      if (!lineWidth) lineWidth = arcLineWidth

      item.lineWidth = lineWidth
    })
  })

  return gauges
}

function calcGaugesDataAngles (gauges, chart) {
  gauges.forEach(gaugeItem => {
    const { startAngle, endAngle, data, min, max } = gaugeItem
    
    const angleMinus = startAngle - endAngle
    const valueMinus = max - min

    data.forEach(item => {
      const { value } = item

      const itemAngle = (value - min) / valueMinus * angleMinus

      item.startAngle = startAngle
      item.endAngle = startAngle + itemAngle
    })
  })

  return gauges
}

function calcGaugesDataGradient (gauges, chart) {
  gauges.forEach(gaugeItem => {
    const { data } = gaugeItem

    data.forEach(item => {
      let { color, gradient } = item

      if (!gradient) gradient = color

      if (!(gradient instanceof Array)) gradient = [gradient]

      if (gradient.length < 2) gradient = [gradient[0], gradient[0]]

      item.gradient = gradient
    })
  })

  return gauges
}