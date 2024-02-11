import type { City, Cities, Reference, KeyType } from '@ag-resourse-logistic/core'

type References = {
  Cities: Map<string, City>
  [key: string]: Map<KeyType, Reference>
}
export const useReferences = () => {
  /** @todo: API call */
  const cities: Cities = [
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
  const citiesMap = new Map(cities.map((city) => [city.id, city]))

  const references: References = {
    Cities: citiesMap
  }
  return references
}
