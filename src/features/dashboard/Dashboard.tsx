import {
  Plane,
  Luggage,
  ScanLine,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react'

import { useAppData } from '../../context/AppDataContext'


export default function Dashboard() {

  const { flights, baggage, resetData } = useAppData()

  function handleReset() {
    const confirmed = window.confirm(
      'Are you sure you want to reset all demo data? This action cannot be undone.',
    )

    if (confirmed) {
      resetData()
    }
  }
  const totalFlights = flights.length

  const totalBaggage = baggage.length

  const scannedBaggage = baggage.filter(
    (item) => item.status === 'loaded',
  ).length

  const pendingBaggage = totalBaggage - scannedBaggage
  const stats = [
    {
      label: 'Total Flights',
      value: totalFlights,
      description: 'Registered flights',
      icon: Plane,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Baggage',
      value: totalBaggage,
      description: 'Across all flights',
      icon: Luggage,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      label: 'Scanned Baggage',
      value: scannedBaggage,
      description: 'Successfully scanned',
      icon: ScanLine,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Pending Baggage',
      value: pendingBaggage,
      description: 'Awaiting valid scan',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor flight operations and baggage reconciliation.
        </p>
      </div>

      <button
        onClick={handleReset}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
      >
        <RotateCcw size={16} />
        Reset Demo Data
      </button>
    </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2.5 ${stat.bg} ${stat.color}`}>
                  <Icon size={21} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300" />
              </div>

              <p className="mt-5 text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          )
        })}
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">Active Flights</h2>
            <p className="mt-1 text-xs text-slate-500">
              Flight departure and baggage status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Flight</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium">Departure</th>
                <th className="px-6 py-4 font-medium">Baggage</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {flights.map((flight) => {
                const flightBaggage = baggage.filter(
                  (item) => item.flightId === flight.id,
                )

                const loaded = flightBaggage.filter(
                  (item) => item.status === 'loaded',
                ).length

                return (
                  <tr key={flight.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {flight.flightNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {flight.destination}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {flight.departureTime}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {loaded} / {flightBaggage.length}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {flight.status}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
