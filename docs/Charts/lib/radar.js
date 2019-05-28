import { radarConfig } from '../config/index'

import { deepClone, getCircleRadianPoint } from '@jiaminghi/c-render/lib/util'

import { deepMerge } from '../util'

export function radar (chart, option = {}) {
  const { series } = option

  if (!series) return removeRadars(chart)

  initChartRadar(chart)

  let radars = series.filter(({ type }) => type === 'radar')

  if (!radars.length) return removeRadars(chart)

  radars = mergePieDefaultConfig(radars)

  radars = filterShowRadars(radars)

  radars = calcRadarPosition(radars, chart)

  updateRadarFills(radars)

  console.warn(radars)
}

function removeRadars (chart) {

}

function initChartRadar (chart) {
  const { radarLine, radarFill, radarPoint, radarLabel } = chart

  if (!radarLine) chart.radarLine = []
  if (!radarFill) chart.radarFill = []
  if (!radarPoint) chart.radarPoint = []
  if (!radarLabel) chart.radarLabel = []
}

function mergePieDefaultConfig (radars) {
  return radars.map(radar => deepMerge(deepClone(radarConfig, true), radar))
}

function filterShowRadars (radars) {
  return radars.filter(({ show }) => show)
}

function calcRadarPosition (radars, chart) {
  const { radarAxis } = chart

  const { indicator, axisLineAngles, radius, centerPos } = radarAxis

  radars.forEach(radarItem => {
    const { data } = radarItem

    radarItem.radarPosition = data.map((v, i) => {
      let { max, min } = indicator[i]

      if (typeof max !== 'number') max = v
      if (typeof min !== 'number') min = 0

      const dataRadius = (v - min) / (max - min) * radius

      return getCircleRadianPoint(...centerPos, dataRadius, axisLineAngles[i])
    })
  })

  return radars
}

function updateRadarFills (radars, chart) {
  const { radarFill: radarFillCache } = chart

  radars.forEach((radarItem, i) => {
    const cache = radarFillCache[i]

    if (cache) {
      changeRadarFill(radarItem, radarFillCache, i, chart)
    } else {
      addNewRadarFills(radarItem, radarFillCache, i, chart)
    }
  })
}

function addNewRadarFills (radars, chart) {
  const { animationCurve, animationFrame } = 
}