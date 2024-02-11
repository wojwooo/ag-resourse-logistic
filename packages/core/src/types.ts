import { Enums } from '..'
import type { OrderStatus } from '..'

export type EnumType = keyof typeof Enums
export type ReferenceType = 'Cities'
export type Reference = { id: KeyType; presentation: string }
export type KeyType = string | number

export type City = Omit<Reference, 'id'> & { id: string }
export type Cities = City[]
export type DBOrder = {
  date: Date
  cityFrom?: string
  cityTo?: string
  weight: number
  truckload: number
}

export type Order = {
  id?: number
  date: string
  cityFrom?: string
  addressFrom?: string
  contactsFrom?: string
  cityTo?: string
  addressTo?: string
  contactsTo?: string
  freight?: string
  weight?: number
  status?: keyof typeof OrderStatus
  carMake?: string
  regNumber?: string
  truckload?: number
  startPosition?: string
  startDatePlan?: string
  startDate?: string
  departureDatePlan?: string
  departureDate?: string
  arrivalDatePlan?: string
  arrivalDate?: string
  endDatePlan?: string
  endDate?: string
}
export type Orders = Order[]

export type AvailableTrack = {
  state: string
  carMake: string
  regNumber: string
  truckload: number
  minDate: string
  position: string
}
export type AvailableTracks = AvailableTrack[]
