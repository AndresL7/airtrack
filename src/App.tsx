
import { useState } from 'react'

import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './features/dashboard/Dashboard'
import Flights from './features/flights/Flights'
import Scanner from './features/scanner/Scanner'
import Reconciliation from './features/reconciliation/Reconciliation'

import { AppDataProvider } from './context/AppDataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './features/auth/Auth'

function AppContent() {
  const { session, loading } = useAuth()
  const [activePage, setActivePage] = useState('Overview')

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading AirTrack...
        </p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="min-w-0 flex-1">
        <Header />

        <div className="p-8">
          {activePage === 'Overview' && <Dashboard />}
          {activePage === 'Flights' && <Flights />}
          {activePage === 'Baggage Scanner' && <Scanner />}
          {activePage === 'Reconciliation' && <Reconciliation />}

          {![
            'Overview',
            'Flights',
            'Baggage Scanner',
            'Reconciliation',
          ].includes(activePage) && (
            <div className="rounded-xl border border-slate-200 bg-white p-8">
              <h1 className="text-xl font-semibold text-slate-900">
                {activePage}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                This module is under development.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </AuthProvider>
  )
}

export default App
