import axios from 'axios'
import { getMockResponse, shouldUseMock } from '../mocks/mockAdapter.js'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 3000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

async function withMockFallback(method, url, config = {}) {
  const params = config.params || {}
  try {
    return await api.request({ method, url, ...config })
  } catch (err) {
    if (!shouldUseMock(err)) throw err
    console.warn(`[mock fallback] ${method.toUpperCase()} ${url}`)
    return getMockResponse(method, url, params)
  }
}

export const dashboardAPI = {
  getMetrics: (params) => withMockFallback('get', '/dashboard/metrics', { params }),
}

export const alertsAPI = {
  list: (params) => withMockFallback('get', '/alerts/', { params }),
  get: (id) => withMockFallback('get', `/alerts/${id}`),
  generateReport: (id) => withMockFallback('post', `/alerts/${id}/generate-report`),
}

export const investigationsAPI = {
  list: (params) => withMockFallback('get', '/investigations/', { params }),
  get: (id) => withMockFallback('get', `/investigations/${id}`),
}

export const transactionsAPI = {
  list: (params) => withMockFallback('get', '/transactions/', { params }),
}

export const clientsAPI = {
  list: (params) => withMockFallback('get', '/clients/', { params }),
}

export const rulesAPI = {
  list: (params) => withMockFallback('get', '/rules/', { params }),
}

export default api
