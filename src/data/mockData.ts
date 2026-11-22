import type { Flight, Baggage, ScanEvent } from '../types'

export const flights: Flight[] = [
  {
    id: 'FL001',
    flightNumber: 'AV8472',
    origin: 'MDE',
    destination: 'BOG',
    departureTime: '16:30',
    status: 'loading',
  },
  {
    id: 'FL002',
    flightNumber: 'AV9310',
    origin: 'MDE',
    destination: 'MIA',
    departureTime: '17:15',
    status: 'boarding',
  },
  {
    id: 'FL003',
    flightNumber: 'AV2045',
    origin: 'MDE',
    destination: 'CTG',
    departureTime: '18:00',
    status: 'scheduled',
  },
]

export const baggage: Baggage[] = [
  {
    id: 'BG001',
    tag: 'AT001',
    flightId: 'FL001',
    passengerName: 'Carlos Ramirez',
    status: 'loaded',
  },
  {
    id: 'BG002',
    tag: 'AT002',
    flightId: 'FL001',
    passengerName: 'Laura Gomez',
    status: 'loaded',
  },
  {
    id: 'BG003',
    tag: 'AT003',
    flightId: 'FL001',
    passengerName: 'Daniel Torres',
    status: 'registered',
  },
  {
    id: 'BG004',
    tag: 'AT004',
    flightId: 'FL001',
    passengerName: 'Maria Lopez',
    status: 'loaded',
  },
  {
    id: 'BG005',
    tag: 'AT005',
    flightId: 'FL002',
    passengerName: 'Andres Castro',
    status: 'registered',
  },
  {
    id: 'BG006',
    tag: 'AT006',
    flightId: 'FL002',
    passengerName: 'Sofia Martinez',
    status: 'registered',
  },
  {
    id: 'BG007',
    tag: 'AT007',
    flightId: 'FL003',
    passengerName: 'Pedro Morales',
    status: 'registered',
  },
]

export const initialScanEvents: ScanEvent[] = [
  {
    id: 'SC001',
    baggageTag: 'AT001',
    scannedFlightId: 'FL001',
    timestamp: '2026-11-18T14:30:00',
    result: 'accepted',
  },
  {
    id: 'SC002',
    baggageTag: 'AT002',
    scannedFlightId: 'FL001',
    timestamp: '2026-11-18T14:32:00',
    result: 'accepted',
  },
  {
    id: 'SC003',
    baggageTag: 'AT004',
    scannedFlightId: 'FL001',
    timestamp: '2026-11-18T14:35:00',
    result: 'accepted',
  },
]
