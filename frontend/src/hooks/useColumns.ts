import { DateValueFormat, Enums } from '@ag-resourse-logistic/core'
import { useDate, useReferences } from '@/hooks'
import { formatNumber } from '@/utils'
import type { EnumType, ReferenceType } from '@ag-resourse-logistic/core'

export type TableColumn = {
  prop?: string
  label: string
  type?: 'date' | 'dateTime' | 'time' | 'enum' | 'int' | 'number' | 'ref'
  referenceType?: ReferenceType
  enumType?: EnumType
  hidden?: boolean
  children?: TableColumn[]
  //function that fTableColumnormats cell content
  formatter?: (row: TableRow, column: TableColumn, cellValue: CellValue, index: number) => string
}
export type TableColumns = TableColumn[]
export type TableRow = Record<string, CellValue>
export type CellValue = string | number | object | undefined

export const useColumns = () => {
  const references = useReferences()
  const { dateFromString, formatDate, formatDateTime, formatTime } = useDate()

  const dateFormatter = (row: TableRow, column: TableColumn, cellValue: CellValue): string => {
    if (!cellValue) return ''
    if (typeof cellValue !== 'string') {
      console.warn(`Получено неверное значение типа даты ${cellValue}
       ожидается строка в формате ${DateValueFormat}`)
      return ''
    }
    return formatDate(dateFromString(cellValue))
  }

  const dateTimeFormatter = (row: TableRow, column: TableColumn, cellValue: CellValue): string => {
    if (!cellValue) return ''
    if (typeof cellValue !== 'string') {
      console.warn(`Получено неверное значение типа даты ${cellValue}
       ожидается строка в формате ${DateValueFormat}`)
      return ''
    }
    return formatDateTime(dateFromString(cellValue))
  }

  const timeFormatter = (row: TableRow, column: TableColumn, cellValue: CellValue): string => {
    if (!cellValue) return ''
    if (typeof cellValue !== 'string') {
      console.warn(`Получено неверное значение типа даты ${cellValue}
       ожидается строка в формате ${DateValueFormat}`)
      return ''
    }
    return formatTime(dateFromString(cellValue))
  }

  const intFormatter = (row: TableRow, column: TableColumn, cellValue: CellValue): string => {
    if (typeof cellValue !== 'number') {
      console.warn(`Получено неверное значение типа даты ${cellValue}
         ожидается строка в формате ${DateValueFormat}`)
      return ''
    }

    return formatNumber(cellValue)
  }

  const numberFormatter = (row: TableRow, column: TableColumn, cellValue: CellValue): string => {
    if (typeof cellValue !== 'number') {
      console.warn(`Получено неверное значение типа даты ${cellValue}
         ожидается строка в формате ${DateValueFormat}`)
      return ''
    }

    return formatNumber(cellValue, 2)
  }

  const refFormatter = (reference: ReferenceType, cellValue: CellValue): string => {
    if (typeof cellValue !== 'number' && typeof cellValue !== 'string') {
      console.warn(`Получено неверное значение ссылки справочника ${cellValue}
         ожидается число или строка`)
      return ''
    }

    const ref = references[reference]?.get(cellValue as any)
    if (!ref) {
      return `Объект не найден (${cellValue})`
    }

    return ref.presentation
  }

  const enumFormatter = (enumType: EnumType, cellValue: CellValue): string => {
    if (typeof cellValue !== 'number' && typeof cellValue !== 'string') {
      console.warn(`Получено неверное значение ссылки справочника ${cellValue}
         ожидается число или строка`)
      return ''
    }

    try {
      const enumValue = (Enums[enumType] as any)[cellValue as any]
      if (enumValue) return enumValue
    } catch {
      //empty
    }

    return `Перечисление не найдено (${cellValue})`
  }

  const setColumnsFormatter: any = (columns: TableColumns) => {
    columns.forEach((column) => {
      switch (column.type) {
        //В колонках даты ожидаем строку в формате DateValueFormat ('YYYY-MM-DDTHH:mm:ss')
        case 'date':
          column.formatter = dateFormatter
          break
        case 'dateTime':
          column.formatter = dateTimeFormatter
          break
        case 'time':
          column.formatter = timeFormatter
          break
        case 'int':
          column.formatter = intFormatter
          break
        case 'number':
          column.formatter = numberFormatter
          break
        case 'ref':
          if (column.referenceType) {
            const referenceType = column.referenceType
            column.formatter = (row, column, cellValue) => refFormatter(referenceType, cellValue)
          }
          break
        case 'enum':
          if (column.enumType) {
            const enumType = column.enumType
            column.formatter = (row, column, cellValue) => enumFormatter(enumType, cellValue)
          }
          break
        default:
          break
      }
      if (column.children) {
        column.children = setColumnsFormatter(column.children)
      }
    })
    return columns
  }
  return {
    setColumnsFormatter
  }
}
