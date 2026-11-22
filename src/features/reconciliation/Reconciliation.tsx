import { Fragment, useState } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  PackageX,
  Plane,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

import { useAppData } from '../../context/AppDataContext'

export default function Reconciliation() {
  const { flights, baggage, scanEvents } = useAppData()

  const [selectedFlightId, setSelectedFlightId] = useState(
    flights[0]?.id ?? '',
  )
  const [searchTerm, setSearchTerm] = useState('')

  const [expandedBaggageId, setExpandedBaggageId] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'loaded' | 'missing'
  >('all')
  const selectedFlight = flights.find(
    (flight) => flight.id === selectedFlightId,
  )

  const flightBaggage = baggage.filter(
    (item) => item.flightId === selectedFlightId,
  )

  const loadedBaggage = flightBaggage.filter(
    (item) => item.status === 'loaded',
  )

  const missingBaggage = flightBaggage.filter(
    (item) => item.status === 'registered',
  )

  const unexpectedScans = scanEvents.filter(
    (event) =>
      event.scannedFlightId === selectedFlightId &&
      ['wrong_flight', 'unknown'].includes(event.result),
  )

  const unexpectedTags = [
    ...new Set(unexpectedScans.map((event) => event.baggageTag)),
  ]

  const expectedCount = flightBaggage.length
  const loadedCount = loadedBaggage.length
  const missingCount = missingBaggage.length

  const filteredBaggage = flightBaggage.filter((item) => {
    const search = searchTerm.trim().toLowerCase()

    const matchesSearch =
      item.tag.toLowerCase().includes(search) ||
      item.passengerName.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'loaded' && item.status === 'loaded') ||
      (statusFilter === 'missing' && item.status === 'registered')

    return matchesSearch && matchesStatus
  })

  function getBaggageScanHistory(tag: string) {
    return scanEvents
      .filter((event) => event.baggageTag === tag)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime(),
      )
  }

  const completion =
    expectedCount > 0
      ? Math.round((loadedCount / expectedCount) * 100)
      : 0

  const stats = [
    {
      label: 'Expected Baggage',
      value: expectedCount,
      description: 'Registered for this flight',
      icon: ClipboardList,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Loaded Baggage',
      value: loadedCount,
      description: 'Successfully scanned',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Missing Baggage',
      value: missingCount,
      description: 'Awaiting loading',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Unexpected Baggage',
      value: unexpectedTags.length,
      description: 'Incorrect or unknown tags',
      icon: PackageX,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Baggage Reconciliation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare registered baggage against actual loading operations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Plane size={18} className="text-slate-500" />

          <select
            value={selectedFlightId}
            onChange={(event) => setSelectedFlightId(event.target.value)}
            className="bg-transparent text-sm font-medium text-slate-700 outline-none"
          >
            {flights.map((flight) => (
              <option key={flight.id} value={flight.id}>
                {flight.flightNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Flight Information */}
      {selectedFlight ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Selected Flight
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                {selectedFlight.flightNumber}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {selectedFlight.origin} → {selectedFlight.destination}
                {' · '}
                Departure: {selectedFlight.departureTime}
              </p>
            </div>

            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium capitalize text-blue-700">
              {selectedFlight.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No flights available.
        </div>
      )}

      {/* Statistics */}
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
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {stat.label}
              </p>

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

      {/* Loading Progress */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Loading Completion
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Baggage loading progress for this flight
            </p>
          </div>

          <span className="text-2xl font-bold text-slate-900">
            {completion}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {loadedCount} of {expectedCount} registered bags loaded
        </p>
      </section>

      {/* Baggage Manifest */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Baggage Manifest
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Registered baggage and its current loading status
          </p>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Search */}
    <div className="relative w-full sm:max-w-sm">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search tag or passenger..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Status Filters */}
    <div className="flex items-center gap-2">
      {(['all', 'loaded', 'missing'] as const).map((filter) => {
        const isActive = statusFilter === filter

        const labels = {
          all: 'All',
          loaded: 'Loaded',
          missing: 'Missing',
        }

        return (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {labels[filter]}
          </button>
        )
      })}
    </div>
  </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Baggage Tag</th>
                <th className="px-6 py-4 font-medium">Passenger</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Scan</th>
              </tr>
            </thead>

            
  <tbody className="divide-y divide-slate-100">
    {filteredBaggage.map((item) => {
      const history = getBaggageScanHistory(item.tag)
      const lastScan = history[0]
      const isExpanded = expandedBaggageId === item.id

      return (
        <Fragment key={item.id}>
          {/* Main baggage row */}
          <tr className="hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-slate-800">
              {item.tag}
            </td>

            <td className="px-6 py-4 text-slate-600">
              {item.passengerName}
            </td>

            <td className="px-6 py-4">
              {item.status === 'loaded' ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Loaded
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Missing
                </span>
              )}
            </td>

            <td className="px-6 py-4">
              {lastScan ? (
                <div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      lastScan.result === 'accepted'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {lastScan.result.replace('_', ' ')}
                  </span>

                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(lastScan.timestamp).toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {history.length} scan(s)
                  </p>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  Not scanned
                </span>
              )}

              <button
                type="button"
                onClick={() =>
                  setExpandedBaggageId(
                    isExpanded ? null : item.id
                  )
                }
                className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? (
                  <>
                    Hide history <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    View history <ChevronDown size={14} />
                  </>
                )}
              </button>
            </td>
          </tr>

          {/* Expanded scan history */}
          {isExpanded && (
            <tr className="bg-slate-50">
              <td colSpan={4} className="px-6 py-5">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    Scan History — {item.tag}
                  </h3>

                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((event, index) => {
                        const eventFlight = flights.find(
                          (flight) =>
                            flight.id === event.scannedFlightId
                        )

                        const resultStyles = {
                          accepted: 'bg-emerald-50 text-emerald-700',
                          duplicate: 'bg-amber-50 text-amber-700',
                          wrong_flight: 'bg-red-50 text-red-700',
                          unknown: 'bg-red-50 text-red-700',
                        }

                        return (
                          <div
                            key={`${event.timestamp}-${index}`}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />

                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-slate-800">
                                  {new Date(event.timestamp).toLocaleString()}
                                </span>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    resultStyles[event.result]
                                  }`}
                                >
                                  {event.result.replace('_', ' ')}
                                </span>
                              </div>

                              <p className="mt-1 text-xs text-slate-500">
                                Flight: {eventFlight?.flightNumber ?? 'Unknown flight'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No scan history available.
                    </p>
                  )}
                </div>
              </td>
            </tr>
          )}
        </Fragment>
      )
    })}

      {filteredBaggage.length === 0 && (
        <tr>
        <td
          colSpan={4}
          className="px-6 py-10 text-center text-slate-400"
        >
          {searchTerm || statusFilter !== 'all'
               ? 'No baggage matches your search or selected filter.'
               : 'No baggage registered for this flight.'}
        </td>
       </tr>
    )}
  </tbody>

        </table>
        </div>
      </section>

      {/* Unexpected Scans */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Unexpected Scans
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Unknown baggage or baggage assigned to another flight
          </p>
        </div>

        {unexpectedTags.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {unexpectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="font-medium text-slate-700">
                  {tag}
                </span>

                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  Unexpected
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-center text-sm text-slate-400">
            No unexpected baggage scans recorded.
          </p>
        )}
      </section>
    </div>
  )
}
