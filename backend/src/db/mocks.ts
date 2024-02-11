import type { Cities } from '@ag-resourse-logistic/core'

import dayjs from 'dayjs'

export const cities: Cities = [
  {
    id: 'msk',
    presentation: 'Москва'
  },
  {
    id: 'pdl',
    presentation: 'Подольск'
  },
  {
    id: 'sph',
    presentation: 'Серпухов'
  },
  {
    id: 'tl',
    presentation: 'Тула'
  },
  {
    id: 'klg',
    presentation: 'Калуга'
  }
]
export const routes = [
  { from: 'msk', to: 'pdl', transitTime: 90, distance: 50 },
  { from: 'msk', to: 'sph', transitTime: 120, distance: 110 },
  { from: 'msk', to: 'tl', transitTime: 190, distance: 185 },
  { from: 'msk', to: 'klg', transitTime: 200, distance: 200 }
]

export const orders = Array.from({ length: 30 }).map((_, i) => {
  const routeIndex = i % routes.length
  const day = Math.floor(i / routes.length)
  const date = dayjs().startOf('day').add(day, 'day')
  const route = routes[routeIndex]
  const row = {
    date: date.toDate(),
    cityFrom: route.from,
    cityTo: route.to,
    weight: 1300,
    status: 'draft'
  }
  return row
})
