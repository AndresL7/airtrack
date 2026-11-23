
import {
  LayoutDashboard,
  Plane,
  ScanBarcode,
  ClipboardCheck,
  Settings,
  Luggage,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import { useAuth, type UserRole } from '../../context/AuthContext'

interface NavigationItem {
  label: string
  icon: LucideIcon
  roles: UserRole[]
}

const navigation: NavigationItem[] = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    roles: ['admin', 'supervisor', 'operator'],
  },
  {
    label: 'Flights',
    icon: Plane,
    roles: ['admin', 'supervisor'],
  },
  {
    label: 'Baggage Scanner',
    icon: ScanBarcode,
    roles: ['admin', 'supervisor', 'operator'],
  },
  {
    label: 'Reconciliation',
    icon: ClipboardCheck,
    roles: ['admin', 'supervisor'],
  },
]

interface SidebarProps {
  activePage: string
  onNavigate: (page: string) => void
}

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  const { profile } = useAuth()

  const userRole = profile?.role ?? 'operator'

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  )

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="rounded-lg bg-blue-600 p-2">
          <Luggage size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">AirTrack</h1>
          <p className="text-xs text-slate-400">Airport Operations</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        {visibleNavigation.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.label

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {userRole === 'admin' && (
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={() => onNavigate('Settings')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
              activePage === 'Settings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings size={19} />
            Settings
          </button>
        </div>
      )}
    </aside>
  )
}
