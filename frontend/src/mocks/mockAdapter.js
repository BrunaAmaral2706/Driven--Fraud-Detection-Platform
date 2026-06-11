import seedData from './data/seed.json'

const {
  dashboard: defaultDashboard,
  alerts,
  investigations,
  transactions,
  clients,
  rules,
  alertDetails,
  investigationDetails,
  reports,
} = seedData

function inDateRange(isoDate, dateFrom, dateTo) {
  const d = new Date(isoDate)
  if (dateFrom) {
    const start = new Date(`${dateFrom}T00:00:00`)
    if (d < start) return false
  }
  if (dateTo) {
    const end = new Date(`${dateTo}T23:59:59`)
    if (d > end) return false
  }
  return true
}

function paginate(items, skip = 0, limit = 50) {
  const slice = items.slice(skip, skip + limit)
  return { total: items.length, items: slice }
}

function computeDashboardMetrics(dateFrom, dateTo) {
  const alertItems = alerts.items.filter(a => inDateRange(a.created_at, dateFrom, dateTo))
  const txItems = transactions.items.filter(t => inDateRange(t.created_at, dateFrom, dateTo))

  const typeCounts = {}
  const statusCounts = {}
  let scoreSum = 0

  for (const a of alertItems) {
    typeCounts[a.fraud_type] = (typeCounts[a.fraud_type] || 0) + 1
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1
    scoreSum += Number(a.risk_score) || 0
  }

  const recent = [...alertItems]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      alert_code: a.alert_code,
      fraud_type: a.fraud_type,
      status: a.status,
      risk_score: a.risk_score,
      amount: a.amount,
      created_at: a.created_at,
      user: a.user ? { name: a.user.name } : null,
    }))

  return {
    total_alerts: alertItems.length,
    critical_alerts: alertItems.filter(a => Number(a.risk_score) >= 80).length,
    avg_risk_score: alertItems.length ? Math.round((scoreSum / alertItems.length) * 10) / 10 : 0,
    suspicious_transactions: txItems.filter(t => Number(t.risk_score) >= 60).length,
    alerts_by_type: Object.entries(typeCounts).map(([type, count]) => ({ type, count })),
    alerts_by_status: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    recent_alerts: recent,
  }
}

function filterAlerts(params = {}) {
  let items = [...alerts.items]
  if (params.status) items = items.filter(a => a.status === params.status)
  if (params.fraud_type) items = items.filter(a => a.fraud_type === params.fraud_type)
  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return paginate(items, params.skip || 0, params.limit || 50)
}

function mockAxiosResponse(data) {
  return { data, status: 200, statusText: 'OK', headers: {}, config: {} }
}

export function getMockResponse(method, url, params = {}) {
  const path = url.replace(/^\//, '')

  if (method === 'get' && path === 'dashboard/metrics') {
    const { date_from: dateFrom, date_to: dateTo } = params
    if (!dateFrom && !dateTo) return mockAxiosResponse(defaultDashboard)
    return mockAxiosResponse(computeDashboardMetrics(dateFrom, dateTo))
  }

  if (method === 'get' && path === 'alerts/') {
    return mockAxiosResponse(filterAlerts(params))
  }

  if (method === 'get' && path.startsWith('alerts/') && !path.includes('generate-report')) {
    const id = path.split('/')[1]
    const detail = alertDetails[id]
    if (!detail) throw new Error('Alerta não encontrado')
    return mockAxiosResponse(detail)
  }

  if (method === 'post' && path.match(/^alerts\/\d+\/generate-report$/)) {
    const id = path.split('/')[1]
    const report = reports[id]
    if (!report) throw new Error('Alerta não encontrado')
    return mockAxiosResponse(report)
  }

  if (method === 'get' && path === 'investigations/') {
    const items = [...investigations.items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )
    return mockAxiosResponse(paginate(items, params.skip || 0, params.limit || 50))
  }

  if (method === 'get' && path.startsWith('investigations/')) {
    const id = path.split('/')[1]
    const detail = investigationDetails[id]
    if (!detail) throw new Error('Investigação não encontrada')
    return mockAxiosResponse(detail)
  }

  if (method === 'get' && path === 'transactions/') {
    const items = [...transactions.items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )
    return mockAxiosResponse(paginate(items, params.skip || 0, params.limit || 50))
  }

  if (method === 'get' && path === 'clients/') {
    const items = [...clients.items].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    )
    return mockAxiosResponse(paginate(items, params.skip || 0, params.limit || 50))
  }

  if (method === 'get' && path === 'rules/') {
    const items = [...rules.items]
    return mockAxiosResponse(paginate(items, params.skip || 0, params.limit || 50))
  }

  throw new Error(`Mock não disponível para ${method.toUpperCase()} /${path}`)
}

export function shouldUseMock(err) {
  if (!err) return false
  if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') return true
  if (!err.response) return true
  const status = err.response.status
  return status >= 500 || status === 404
}
