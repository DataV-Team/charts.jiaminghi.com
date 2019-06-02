export class Updater {
  constructor (config, series) {
    const { chart, key, getGraphConfig } = config

    if (typeof getGraphConfig !== 'function') {
      console.warn('Updater need function getGraphConfig!')

      return
    }

    if (!chart[key]) this.graphs = chart[key] = []

    Object.assign(this, config)

    this.update(series)
  }
}

Updater.prototype.update = function (series) {
  const { graphs } = this

  delRedundanceGraph(this, series)

  if (!series.length) return

  series.forEach((seriesItem, i) => {
    const cache = graphs[i]

    if (cache) {
      changeGraphs(cache, seriesItem, i, this)
    } else {
      addGraphs(graphs, seriesItem, i, this)
    }
  })
}

function delRedundanceGraph (updater, series) {
  const { graphs, chart: { render } } = updater

  const cacheGraphNum = graphs.length
  const needGraphNum = series.length

  if (cacheGraphNum > needGraphNum) {
    const needDelGraphs = graphs.splice(needGraphNum)

    needDelGraphs.forEach(item => item.forEach(g => render.delGraph(g)))
  }
}

function changeGraphs (cache, seriesItem, i, updater) {
  const { getGraphConfig, chart: { render }, beforeUpdate } = updater

  const configs = getGraphConfig(seriesItem)

  balanceGraphsNum(cache, configs, render)

  cache.forEach((graph, j) => {
    const config = configs[j]
    
    if (typeof beforeUpdate === 'function') beforeUpdate(graph, config)

    updateGraphConfigByKey(graph, config)
  })
}

function balanceGraphsNum (graphs, graphConfig, render) {
  const cacheGraphNum = graphs.length
  const needGraphNum = graphConfig.length

  if (needGraphNum > cacheGraphNum) {
    const lastCacheGraph = graphs.slice(-1)[0]

    const needAddGraphNum = needGraphNum - cacheGraphNum

    const needAddGraphs = new Array(needAddGraphNum).fill(0).map(foo => render.clone(lastCacheGraph))

    graphs.push(...needAddGraphs)
  } else if (needGraphNum < cacheGraphNum) {
    const needDelCache = graphs.splice(needGraphNum)

    needDelCache.forEach(g => render.delGraph(g))
  }
}

function addGraphs (graphs, seriesItem, i, updater) {
  const { getGraphConfig, getStartGraphConfig, chart } = updater

  const { render } = chart

  let startConfigs = null

  if (typeof getStartGraphConfig === 'function') startConfigs = getStartGraphConfig(seriesItem)

  const configs = getGraphConfig(seriesItem)

  if (startConfigs) {
    graphs[i] = startConfigs.map(config => render.add(config))

    graphs[i].forEach((graph, i) => {
      const config = configs[i]

      updateGraphConfigByKey(graph, config)
    })
  } else {
    graphs[i] = configs.map(config => render.add(config))
  }
}

function updateGraphConfigByKey (graph, config) {
  const keys = Object.keys(config)

  keys.forEach(key => {
    if (key === 'shape' || key === 'style') {
      graph.animation(key, config[key], true)
    } else {
      graph[key] = config[key]
    }
  })
}
