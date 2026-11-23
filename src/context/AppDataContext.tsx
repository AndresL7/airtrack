import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'

import type {
  Flight,
  Baggage,
  ScanEvent,
  ScanResult,
} from '../types'

import {
  flights as initialFlights,
  baggage as initialBaggage,
  initialScanEvents,
} from '../data/mockData'

import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// 1. Application state

interface AppState {
  flights: Flight[]
  baggage: Baggage[]
  scanEvents: ScanEvent[]
}

const initialState: AppState = {
  flights: initialFlights,
  baggage: initialBaggage,
  scanEvents: initialScanEvents,
}


function reconcileState(state: AppState): AppState {
  const baggageByTag = new Map(
    state.baggage.map((item) => [item.tag, item]),
  )

  const acceptedTags = new Set<string>()

  const scanEvents = state.scanEvents.map((event) => {
    if (event.result !== 'accepted') {
      return event
    }

    const bag = baggageByTag.get(event.baggageTag)

    if (!bag) {
      return { ...event, result: 'unknown' as const }
    }

    if (bag.flightId !== event.scannedFlightId) {
      return { ...event, result: 'wrong_flight' as const }
    }

    if (acceptedTags.has(event.baggageTag)) {
      return { ...event, result: 'duplicate' as const }
    }

    acceptedTags.add(event.baggageTag)

    return event
  })

  const baggage = state.baggage.map((item) => ({
    ...item,
    status: acceptedTags.has(item.tag)
      ? 'loaded' as const
      : 'registered' as const,
  }))

  return {
    ...state,
    baggage,
    scanEvents,
  }
}


const STORAGE_KEY = 'airtrack_state'

function getInitialState(): AppState {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (savedState) {
      const parsedState = JSON.parse(savedState) as AppState

      return reconcileState(parsedState)
    }
  } catch (error) {
    console.error('Error loading AirTrack state:', error)
  }

  return reconcileState(initialState)
}

// 2. Actions

type AppAction =
  
  | {
      type: 'SET_FLIGHTS'
      payload: Flight[]
    }

  | {
      type: 'ADD_FLIGHT'
      payload: Flight
    }
  | {
      type: 'UPDATE_FLIGHT'
      payload: Flight
    }
  | {
      type: 'DELETE_FLIGHT'
      payload: string
    }
  | {
      type: 'SCAN_BAGGAGE'
      payload: {
        baggageTag: string
        scannedFlightId: string
        timestamp: string
        eventId: string
        result: ScanResult
      }
    }
  | {
      type: 'RESET_DATA'
    }

// 3. Reducer

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case 'SET_FLIGHTS':
      return {
        ...state,
        flights: action.payload,
      }
    
    case 'ADD_FLIGHT': {
        const exists = state.flights.some(
            (flight) =>
            flight.flightNumber.toLowerCase() ===
            action.payload.flightNumber.toLowerCase(),
        )

        if (exists) return state

        return {
            ...state,
            flights: [...state.flights, action.payload],
        }
        }

      case 'UPDATE_FLIGHT': {
        const exists = state.flights.some(
            (flight) =>
            flight.id !== action.payload.id &&
            flight.flightNumber.toLowerCase() ===
                action.payload.flightNumber.toLowerCase(),
        )

        if (exists) return state

        return {
            ...state,
            flights: state.flights.map((flight) =>
            flight.id === action.payload.id
                ? action.payload
                : flight,
            ),
        }
        }

        case 'DELETE_FLIGHT': {
        const hasBaggage = state.baggage.some(
            (item) => item.flightId === action.payload,
        )

        if (hasBaggage) return state

        return {
            ...state,
            flights: state.flights.filter(
            (flight) => flight.id !== action.payload,
            ),
        }
        }

      case 'SCAN_BAGGAGE': {
        const { payload } = action

        const updatedBaggage =
          payload.result === 'accepted'
            ? state.baggage.map((item) =>
              item.tag === payload.baggageTag
                ? { ...item, status: 'loaded' as const }
                : item,
            )
          : state.baggage

      const newEvent: ScanEvent = {
        id: payload.eventId,
        baggageTag: payload.baggageTag,
        scannedFlightId: payload.scannedFlightId,
        timestamp: payload.timestamp,
        result: payload.result,
      }

      return {
        ...state,
        baggage: updatedBaggage,
        scanEvents: [newEvent, ...state.scanEvents],
      }
    }
    case 'RESET_DATA':
        return {
            flights: initialFlights,
            baggage: initialBaggage,
            scanEvents: initialScanEvents,
        }
    default:
      return state
  }
}

// 4. Context interface

interface AppDataContextType extends AppState {
  addFlight: (flight: Omit<Flight, 'id'>) => string | null
  updateFlight: (flight: Flight) => string | null
  deleteFlight: (flightId: string) => boolean
  scanBaggage: (
    tag: string,
    flightId: string,
  ) => ScanResult
  resetData: () => void
}

const AppDataContext = createContext<AppDataContextType | undefined>(
  undefined,
)

// 5. Provider

interface AppDataProviderProps {
  children: ReactNode
}

export function AppDataProvider({
  children,
}: AppDataProviderProps) {
  const [state, dispatch] = useReducer(
  appReducer,
  undefined,
  getInitialState,
)

const { session } = useAuth()

  useEffect(() => {
    if (!session) return

    async function loadFlights() {
      const { data, error } = await supabase
        .from('flights')
        .select(
          'id, flight_number, origin, destination, scheduled_departure, status',
        )
        .order('scheduled_departure', { ascending: true })

      if (error) {
        console.error('Error loading flights:', error)
        return
      }

      const mappedFlights: Flight[] = (data ?? []).map((flight) => ({
        id: flight.id,
        flightNumber: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.scheduled_departure,
        status: flight.status as Flight['status'],
      }))

      dispatch({
        type: 'SET_FLIGHTS',
        payload: mappedFlights,
      })
    }

    void loadFlights()
  }, [session])

useEffect(() => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    )
  } catch (error) {
    console.error('Error saving AirTrack state:', error)
  }
}, [state])

function addFlight(flight: Omit<Flight, 'id'>): string | null {
  const flightNumber = flight.flightNumber.trim().toUpperCase()
  const origin = flight.origin.trim().toUpperCase()
  const destination = flight.destination.trim().toUpperCase()

  if (!flightNumber || !origin || !destination || !flight.departureTime.trim()) {
    return 'Please complete all required fields.'
  }

  if (origin === destination) {
    return 'Origin and destination cannot be the same.'
  }

  const exists = state.flights.some(
    (item) => item.flightNumber.toUpperCase() === flightNumber,
  )

  if (exists) {
    return 'A flight with this flight number already exists.'
  }

  dispatch({
    type: 'ADD_FLIGHT',
    payload: {
      ...flight,
      id: crypto.randomUUID(),
      flightNumber,
      origin,
      destination,
    },
  })

  return null
}

function updateFlight(flight: Flight): string | null {
  const flightNumber = flight.flightNumber.trim().toUpperCase()
  const origin = flight.origin.trim().toUpperCase()
  const destination = flight.destination.trim().toUpperCase()

  if (
    !flightNumber ||
    !origin ||
    !destination ||
    !flight.departureTime.trim()
  ) {
    return 'Please complete all required fields.'
  }

  if (origin === destination) {
    return 'Origin and destination cannot be the same.'
  }

  const exists = state.flights.some(
    (item) =>
      item.id !== flight.id &&
      item.flightNumber.toUpperCase() === flightNumber,
  )

  if (exists) {
    return 'A flight with this flight number already exists.'
  }

  const flightExists = state.flights.some(
    (item) => item.id === flight.id,
  )

  if (!flightExists) {
    return 'Flight not found.'
  }

  dispatch({
    type: 'UPDATE_FLIGHT',
    payload: {
      ...flight,
      flightNumber,
      origin,
      destination,
    },
  })

  return null
}

function deleteFlight(flightId: string): boolean {
  const flightExists = state.flights.some(
    (flight) => flight.id === flightId,
  )

  const hasBaggage = state.baggage.some(
    (item) => item.flightId === flightId,
  )

  if (!flightExists || hasBaggage) {
    return false
  }

  dispatch({
    type: 'DELETE_FLIGHT',
    payload: flightId,
  })

  return true
}

  function resetData() {
    dispatch({ type: 'RESET_DATA' })
  }

  function scanBaggage(
    tag: string,
    flightId: string,
  ): ScanResult {
    const normalizedTag = tag.trim().toUpperCase()

    const bag = state.baggage.find(
      (item) => item.tag === normalizedTag,
    )

    let result: ScanResult

    if (!bag) {
      result = 'unknown'
    } else if (bag.flightId !== flightId) {
      result = 'wrong_flight'
    } else if (bag.status === 'loaded') {
      result = 'duplicate'
    } else {
      result = 'accepted'
    }

    dispatch({
      type: 'SCAN_BAGGAGE',
      payload: {
        baggageTag: normalizedTag,
        scannedFlightId: flightId,
        timestamp: new Date().toISOString(),
        eventId: crypto.randomUUID(),
        result,
      },
    })

    return result
  }

  return (
    <AppDataContext.Provider
      value={{
        ...state,
        addFlight,
        updateFlight,
        deleteFlight,
        scanBaggage,
        resetData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

// 6. Custom hook

export function useAppData() {
  const context = useContext(AppDataContext)

  if (!context) {
    throw new Error(
      'useAppData must be used within an AppDataProvider',
    )
  }

  return context
}
