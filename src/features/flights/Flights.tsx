import { useState, type FormEvent } from 'react'
import {
  Search,
  Plane,
  Luggage,
  Plus,
  X,
  Trash2,
} from 'lucide-react'

import type { FlightStatus } from '../../types'

import { useAppData } from '../../context/AppDataContext'

export default function Flights() {
    const {
        flights,
        baggage,
        addFlight,
        updateFlight,
        deleteFlight,
    } = useAppData()

    const [showAddForm, setShowAddForm] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')
    const [showEditForm, setShowEditForm] = useState(false)
    const [editError, setEditError] = useState('')
    const [editSuccess, setEditSuccess] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [deleteSuccess, setDeleteSuccess] = useState('')

    const [newFlight, setNewFlight] = useState<{
    flightNumber: string
    origin: string
    destination: string
    departureTime: string
    status: FlightStatus
    }>({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    status: 'scheduled',
    })

    const [editingFlight, setEditingFlight] = useState<{
        id: string
        flightNumber: string
        origin: string
        destination: string
        departureTime: string
        status: FlightStatus
    } | null>(null)

    function handleAddFlight(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setFormError('')
        setFormSuccess('')

        const error = addFlight(newFlight)

        if (error) {
        setFormError(error)
        return
        }

        setFormSuccess('Flight successfully registered.')

        setNewFlight({
            flightNumber: '',
            origin: '',
            destination: '',
            departureTime: '',
            status: 'scheduled',
        })

        setShowAddForm(false)
        }    
        
  const [selectedFlightId, setSelectedFlightId] = useState(
    flights[0]?.id ?? '',
  )

  const [search, setSearch] = useState('')

  const selectedFlight = flights.find(
    (flight) => flight.id === selectedFlightId,
  )

  function handleStartEdit() {
    if (!selectedFlight) return

    setEditingFlight({
        id: selectedFlight.id,
        flightNumber: selectedFlight.flightNumber,
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        departureTime: selectedFlight.departureTime,
        status: selectedFlight.status,
    })

    setEditError('')
    setEditSuccess('')
    setShowAddForm(false)
    setShowEditForm(true)
    }
 
  function handleUpdateFlight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editingFlight) return

    setEditError('')
    setEditSuccess('')

    const error = updateFlight(editingFlight)

    if (error) {
        setEditError(error)
        return
    }

    setEditSuccess('Flight successfully updated.')
    setShowEditForm(false)
    setEditingFlight(null)
  }

  function handleDeleteFlight() {
    if (!selectedFlight) return

    const confirmed = window.confirm(
        `Are you sure you want to delete flight ${selectedFlight.flightNumber}?`,
    )

    if (!confirmed) return

    setDeleteError('')
    setDeleteSuccess('')

    const success = deleteFlight(selectedFlight.id)

    if (!success) {
        setDeleteError(
        'Cannot delete this flight because it has registered baggage.',
        )
        return
    }

    const remainingFlights = flights.filter(
        (flight) => flight.id !== selectedFlight.id,
    )

    setSelectedFlightId(remainingFlights[0]?.id ?? '')

    setShowEditForm(false)
    setEditingFlight(null)

    setDeleteSuccess(
        `Flight ${selectedFlight.flightNumber} successfully deleted.`,
    )
  }
  
  const flightBaggage = baggage.filter(
    (item) => item.flightId === selectedFlightId,
  )

  const filteredFlights = flights.filter((flight) =>
    flight.flightNumber.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Flights</h1>
            <p className="mt-1 text-sm text-slate-500">
            Manage flights and monitor registered baggage.
            </p>
        </div>

        <button
            onClick={() => {
            setShowAddForm(!showAddForm)
            setFormError('')
            setFormSuccess('')
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
            {showAddForm ? <X size={17} /> : <Plus size={17} />}
            {showAddForm ? 'Cancel' : 'Add Flight'}
        </button>
        </div>

        {showAddForm && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-slate-900">
            Register New Flight
            </h2>

            <form onSubmit={handleAddFlight}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Flight Number
                </label>
                <input
                    required
                    value={newFlight.flightNumber}
                    onChange={(event) =>
                    setNewFlight({
                        ...newFlight,
                        flightNumber: event.target.value,
                    })
                    }
                    placeholder="e.g. AV8472"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Origin
                </label>
                <input
                    required
                    value={newFlight.origin}
                    onChange={(event) =>
                    setNewFlight({
                        ...newFlight,
                        origin: event.target.value,
                    })
                    }
                    placeholder="e.g. MDE"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Destination
                </label>
                <input
                    required
                    value={newFlight.destination}
                    onChange={(event) =>
                    setNewFlight({
                        ...newFlight,
                        destination: event.target.value,
                    })
                    }
                    placeholder="e.g. BOG"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Departure Time
                </label>
                <input
                    required
                    type="time"
                    value={newFlight.departureTime}
                    onChange={(event) =>
                    setNewFlight({
                        ...newFlight,
                        departureTime: event.target.value,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Flight Status
                </label>
                <select
                    value={newFlight.status}
                    onChange={(event) =>
                    setNewFlight({
                        ...newFlight,
                        status: event.target.value as FlightStatus,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="loading">Loading</option>
                    <option value="boarding">Boarding</option>
                    <option value="departed">Departed</option>
                </select>
                </div>
            </div>

            {formError && (
                <p className="mt-4 text-sm text-red-600">
                {formError}
                </p>
            )}

            <div className="mt-6 flex justify-end">
                <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                Save Flight
                </button>
            </div>
            </form>
        </section>
        )}

        {formSuccess && (
        <p className="text-sm font-medium text-emerald-600">
            {formSuccess}
        </p>
        )}
        
        {editSuccess && (
        <p className="text-sm font-medium text-emerald-600">
            {editSuccess}
        </p>
        )}

        {deleteError && (
        <p className="text-sm font-medium text-red-600">
            {deleteError}
        </p>
        )}

        {deleteSuccess && (
        <p className="text-sm font-medium text-emerald-600">
            {deleteSuccess}
        </p>
        )}

      {showEditForm && editingFlight && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-slate-900">
            Edit Flight
            </h2>

            <form onSubmit={handleUpdateFlight}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Flight Number
                </label>
                <input
                    required
                    value={editingFlight.flightNumber}
                    onChange={(event) =>
                    setEditingFlight({
                        ...editingFlight,
                        flightNumber: event.target.value,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Origin
                </label>
                <input
                    required
                    value={editingFlight.origin}
                    onChange={(event) =>
                    setEditingFlight({
                        ...editingFlight,
                        origin: event.target.value,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Destination
                </label>
                <input
                    required
                    value={editingFlight.destination}
                    onChange={(event) =>
                    setEditingFlight({
                        ...editingFlight,
                        destination: event.target.value,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Departure Time
                </label>
                <input
                    required
                    type="time"
                    value={editingFlight.departureTime}
                    onChange={(event) =>
                    setEditingFlight({
                        ...editingFlight,
                        departureTime: event.target.value,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                </div>

                <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Flight Status
                </label>
                <select
                    value={editingFlight.status}
                    onChange={(event) =>
                    setEditingFlight({
                        ...editingFlight,
                        status: event.target.value as FlightStatus,
                    })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="loading">Loading</option>
                    <option value="boarding">Boarding</option>
                    <option value="departed">Departed</option>
                </select>
                </div>

            </div>

            {editError && (
                <p className="mt-4 text-sm text-red-600">
                {editError}
                </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button
                type="button"
                onClick={() => {
                    setShowEditForm(false)
                    setEditingFlight(null)
                    setEditError('')
                }}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                Cancel
                </button>

                <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                Save Changes
                </button>
            </div>
            </form>
        </section>
        )} 
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-slate-900">
            Flight list
          </h2>

          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search flight..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            {filteredFlights.map((flight) => (
              <button
                key={flight.id}
                onClick={() => setSelectedFlightId(flight.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedFlightId === flight.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">
                    {flight.flightNumber}
                  </span>
                  <Plane size={17} className="text-slate-400" />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {flight.origin} → {flight.destination}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Departure: {flight.departureTime}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          {selectedFlight ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Flight details</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedFlight.flightNumber}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedFlight.origin} → {selectedFlight.destination}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleStartEdit}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Edit Flight
                    </button>

                    <button
                        onClick={handleDeleteFlight}
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete Flight
                    </button>
                    </div>
              </div>

              <div className="my-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Departure</p>
                  <p className="mt-1 text-xl font-semibold">
                    {selectedFlight.departureTime}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Registered baggage</p>
                  <p className="mt-1 text-xl font-semibold">
                    {flightBaggage.length}
                  </p>
                </div>
              </div>

              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                <Luggage size={19} />
                Registered baggage
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3">Bag Tag</th>
                      <th className="py-3">Passenger</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {flightBaggage.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 font-medium">{item.tag}</td>
                        <td className="py-4 text-slate-600">
                          {item.passengerName}
                        </td>
                        <td className="py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs ${
                              item.status === 'loaded'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Select a flight to view its details.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
