export type FlightStatus =
  | 'scheduled'
  | 'loading'
  | 'boarding'
  | 'departed'
  | 'arrived'
  | 'cancelled'

export type BaggageStatus =
  | 'registered'
  | 'loaded'

export type ScanResult =
  | 'accepted'
  | 'wrong_flight'
  | 'duplicate'
  | 'unknown'

export interface Flight {
  id: string
  flightNumber: string
  origin: string
  destination: string
  departureTime: string
  status: FlightStatus
}

export interface Baggage {
  id: string
  tag: string
  flightId: string
  passengerName: string
  status: BaggageStatus
}

export interface ScanEvent {
  id: string
  baggageTag: string
  scannedFlightId: string
  timestamp: string
  result: ScanResult
}
