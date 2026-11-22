
import { useState } from 'react'
import ScanHistory from './components/ScanHistory'
import {
  ScanBarcode,
  Plane,
  Luggage,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import { useAppData } from '../../context/AppDataContext'

export default function Scanner() {
  const { flights, baggage, scanBaggage } = useAppData()

  const [selectedFlightId, setSelectedFlightId] = useState(
    flights[0]?.id ?? '',
  )

  const [tag, setTag] = useState('')
  const [lastResult, setLastResult] = useState<string | null>(null)

  const selectedFlight = flights.find(
    (flight) => flight.id === selectedFlightId,
  )

  const flightBaggage = baggage.filter(
    (item) => item.flightId === selectedFlightId,
  )

  const loadedCount = flightBaggage.filter(
    (item) => item.status === 'loaded',
  ).length

  const pendingCount = flightBaggage.filter(
    (item) => item.status === 'registered',
  ).length

  function handleScan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!tag.trim() || !selectedFlightId) return

    const result = scanBaggage(tag, selectedFlightId)

    setLastResult(result)
    setTag('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Baggage Scanner
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Scan and verify baggage before aircraft loading.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Scanner panel */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ScanBarcode size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Scan baggage
              </h2>
              <p className="text-xs text-slate-500">
                Manual or barcode input
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select flight
          </label>

          <select
            value={selectedFlightId}
            onChange={(event) => {
              setSelectedFlightId(event.target.value)
              setLastResult(null)
            }}
            className="mb-6 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
          >
            {flights.map((flight) => (
              <option key={flight.id} value={flight.id}>
                {flight.flightNumber} — {flight.origin} to {flight.destination}
              </option>
            ))}
          </select>

          <form onSubmit={handleScan}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Baggage tag
            </label>

            <input
              autoFocus
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              placeholder="e.g. AT003"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ScanBarcode size={18} />
              Verify baggage
            </button>
          </form>

          {lastResult && (
            <div className={`mt-5 rounded-lg p-4 text-sm ${
              lastResult === 'accepted'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}>
              <p className="font-semibold">
                {lastResult === 'accepted' && 'Baggage accepted'}
                {lastResult === 'wrong_flight' && 'Wrong flight'}
                {lastResult === 'duplicate' && 'Baggage already loaded'}
                {lastResult === 'unknown' && 'Unknown baggage tag'}
              </p>
            </div>
          )}
        </section>

        {/* Flight overview */}
        <section className="space-y-6 lg:col-span-2">
          {selectedFlight && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <Plane className="text-blue-600" size={22} />
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {selectedFlight.flightNumber}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {selectedFlight.origin} → {selectedFlight.destination}
                      {' · '}
                      {selectedFlight.departureTime}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <CheckCircle2 className="text-emerald-600" />
                    <p className="mt-3 text-2xl font-bold text-emerald-700">
                      {loadedCount}
                    </p>
                    <p className="text-sm text-emerald-700">Loaded</p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4">
                    <Clock className="text-amber-600" />
                    <p className="mt-3 text-2xl font-bold text-amber-700">
                      {pendingCount}
                    </p>
                    <p className="text-sm text-amber-700">Pending</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Luggage size={20} />
                  Baggage manifest
                </h3>

                <div className="space-y-3">
                  {flightBaggage.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.tag}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.passengerName}
                        </p>
                      </div>

                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.status === 'loaded'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <ScanHistory />
      
    </div>
  )
}
