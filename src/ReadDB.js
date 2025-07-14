import axios from 'axios'

export class ReadDB {
  constructor() {
    this.url = 'https://servapibi.xm.com.co/'
    this.inventarioMetricas = []
  }

  async allVariables() {
    const body = { MetricId: 'ListadoMetricas' }
    const response = await axios.post(`${this.url}Lists`, body)
    const items = response.data.Items

    const variables = []

    for (const item of items) {
      const date = item.Date
      for (const entity of item.ListEntities) {
        const values = entity.Values
        variables.push({
          Date: date,
          Entity: entity.Id,
          ...values,
        })
      }
    }

    this.inventarioMetricas = variables
    return variables
  }

  getCollections(coleccion = '') {
    if (!coleccion) return this.inventarioMetricas
    return this.inventarioMetricas.filter((row) => row.MetricId === coleccion)
  }

  async fetchData(body, periodBase, endpoint) {
    const response = await axios.post(`${this.url}${periodBase}`, body, {
      headers: { 'Content-Type': 'application/json' },
    })

    const items = response.data.Items
    return items.flatMap((item) =>
      item[endpoint].map((entity) => ({
        ...entity,
        Date: item.Date,
      }))
    )
  }

  async requestData(coleccion, metrica, startDate, endDate, filtros = []) {
    if (!this.inventarioMetricas.length) await this.allVariables()

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('La fecha inicial debe ser menor o igual a la fecha final.')
    }

    const entityRow = this.inventarioMetricas.find(
      (row) => row.MetricId === coleccion && row.Entity === metrica
    )

    if (!entityRow) {
      console.warn('No existe la métrica o entidad')
      return []
    }

    const periodDict = {
      HourlyEntities: { period_base: 'hourly', endpoint: 'HourlyEntities' },
      DailyEntities: { period_base: 'daily', endpoint: 'DailyEntities' },
      MonthlyEntities: { period_base: 'monthly', endpoint: 'MonthlyEntities' },
      AnnualEntities: { period_base: 'annual', endpoint: 'AnnualEntities' },
    }

    const entityType = entityRow.Type
    const periodConfig = periodDict[entityType]

    if (!periodConfig) {
      console.warn('Tipo de entidad no soportado')
      return []
    }

    const listPeriods = this.generatePeriods(startDate, endDate, entityType)
    const listBodies = listPeriods.map(([end, start]) => ({
      MetricId: coleccion,
      Entity: metrica,
      StartDate: start,
      EndDate: end,
      Filter: filtros,
    }))

    const allData = await Promise.all(
      listBodies.map((body) =>
        this.fetchData(body, periodConfig.period_base, periodConfig.endpoint)
      )
    )

    return allData.flat()
  }

  generatePeriods(start, end, entityType = 'HourlyEntities') {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const periods = []
    let current = new Date(startDate)

    while (current <= endDate) {
      let periodStart = new Date(current)
      let periodEnd

      if (entityType === 'HourlyEntities' || entityType === 'DailyEntities') {
        periodEnd = new Date(current)
        current.setDate(current.getDate() + 1)
      } else {
        periodEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
        if (periodEnd > endDate) periodEnd = new Date(endDate)
        current.setMonth(current.getMonth() + 1)
        current.setDate(1)
      }

      periods.push([this.formatDate(periodStart), this.formatDate(periodEnd)])
    }

    return periods
  }

  formatDate(date) {
    return date.toISOString().split('T')[0]
  }
}
