import { Outlet } from 'react-router-dom'
import { Sidebar } from '@common/Sidebar'
import { Header } from '@common/Header'

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}