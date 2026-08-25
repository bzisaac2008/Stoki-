import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="content-area">
        <Header />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout