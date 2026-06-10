import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Alerts from './pages/Alerts.jsx'
import AlertDetail from './pages/AlertDetail.jsx'
import Investigations from './pages/Investigations.jsx'
import InvestigationDetail from './pages/InvestigationDetail.jsx'
import Transactions from './pages/Transactions.jsx'
import Clients from './pages/Clients.jsx'
import Rules from './pages/Rules.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alertas" element={<Alerts />} />
          <Route path="/alertas/:id" element={<AlertDetail />} />
          <Route path="/investigacoes" element={<Investigations />} />
          <Route path="/investigacoes/:id" element={<InvestigationDetail />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/regras" element={<Rules />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
