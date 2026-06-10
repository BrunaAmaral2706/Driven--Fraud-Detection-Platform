import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { DateRangeProvider } from '../context/DateRangeContext.jsx'

export default function MainLayout() {
  return (
    <DateRangeProvider>
      <div className="flex min-h-screen bg-driven-cream">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </DateRangeProvider>
  )
}
