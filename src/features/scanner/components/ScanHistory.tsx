
import {
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import { useAppData } from '../../../context/AppDataContext'

const resultLabels = {
  accepted: 'Accepted',
  wrong_flight: 'Wrong flight',
  duplicate: 'Duplicate',
  unknown: 'Unknown baggage',
}

export default function ScanHistory() {
  const { scanEvents, flights } = useAppData()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">
          Scan history
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Recent baggage verification events.
        </p>
      </div>

      {scanEvents.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No scan events recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3">Baggage</th>
                <th className="py-3">Flight</th>
                <th className="py-3">Time</th>
                <th className="py-3">Result</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {scanEvents.map((event) => {
                const flight = flights.find(
                  (item) => item.id === event.scannedFlightId,
                )

                const accepted = event.result === 'accepted'

                return (
                  <tr key={event.id}>
                    <td className="py-4 font-medium">
                      {event.baggageTag}
                    </td>

                    <td className="py-4 text-slate-600">
                      {flight?.flightNumber ?? event.scannedFlightId}
                    </td>

                    <td className="py-4 text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString(
                        [],
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </td>

                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        accepted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {accepted ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {resultLabels[event.result]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
