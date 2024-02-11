export const DateFormat = 'DD.MM.YYYY'
export const DateTimeFormat = 'DD.MM.YYYY, HH:mm'
export const DateValueFormat = 'YYYY-MM-DDTHH:mm:ss'
export const TimeFormat = 'HH:mm'
export const OrderStatus = {
  draft: 'Черновик',
  planned: 'Запланирован рейс',
  // trip: 'В пути',
  finished: 'Завершен',
  canceled: 'Отменен'
} as const

export const Enums = {
  OrderStatus: OrderStatus
}
