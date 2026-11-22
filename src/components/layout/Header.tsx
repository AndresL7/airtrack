
import { Bell, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, profile, signOut } = useAuth()

  const fullName = profile?.full_name || user?.email || 'User'

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0].toUpperCase())
    .join('')

  async function handleSignOut() {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Airport Operations Center
        </h2>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={13} />
          José María Cordoba International Airport
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-slate-500 hover:text-slate-800">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {initials}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              {fullName}
            </p>
            <p className="text-xs capitalize text-slate-500">
              {profile?.role || 'Loading profile...'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          title="Sign out"
          aria-label="Sign out"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  )
}
