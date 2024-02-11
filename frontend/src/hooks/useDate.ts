import { DateFormat, DateTimeFormat, DateValueFormat, TimeFormat } from '@ag-resourse-logistic/core'
import dayjs, { type Dayjs } from 'dayjs'

type DateValue = Dayjs | undefined
export const useDate = () => {
  const dateFromString = (value: string): DateValue => {
    const result = dayjs(value, DateValueFormat)
    if (result.isValid()) {
      return result
    }
    console.warn(`Получено неверное значение типа даты ${value}`)
  }
  const formatDate = (date: DateValue): string => {
    if (!date) return ''
    return date.format(DateFormat)
  }

  const formatDateTime = (date: DateValue): string => {
    if (!date) return ''
    return date.format(DateTimeFormat)
  }

  const formatTime = (date: DateValue): string => {
    if (!date) return ''
    return date.format(TimeFormat)
  }

  return {
    dateFromString,
    formatDate,
    formatDateTime,
    formatTime
  }
}
