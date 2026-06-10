import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de erros
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export const dashboardAPI = {
  getMetrics: (params) => api.get('/dashboard/metrics', { params }),
}

export const alertsAPI = {
  list: (params) => api.get('/alerts/', { params }),
  get: (id) => api.get(`/alerts/${id}`),
  generateReport: (id) => api.post(`/alerts/${id}/generate-report`),
}

export const investigationsAPI = {
  list: (params) => api.get('/investigations/', { params }),
  get: (id) => api.get(`/investigations/${id}`),
}

export const transactionsAPI = {
  list: (params) => api.get('/transactions/', { params }),
}

export const clientsAPI = {
  list: (params) => api.get('/clients/', { params }),
}

export const rulesAPI = {
  list: (params) => api.get('/rules/', { params }),
}

export default api
