import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../hooks'

import type { Order, Orders } from '@ag-resourse-logistic/core'

export const useOrdersStore = defineStore('orders', () => {
  const api = useApi()
  const loading = ref(false)
  const saving = ref(false)
  const orders = ref<Orders>([])

  const filters = ref({
    cityFrom: undefined as string | undefined,
    cityTo: undefined as string | undefined,
    status: undefined as string | undefined
  })

  const order = ref<Order | undefined>()

  const get = async () => {
    loading.value = true
    const result = await api.get<Orders>('orders', filters.value)
    if (result) {
      orders.value = result
    }
    loading.value = false
  }

  const save = async () => {
    const savingOrder = order.value
    if (!savingOrder) return
    saving.value = true
    if (!savingOrder.id) {
      const result = await api.post<Order>('orders', savingOrder)
      if (result) {
        orders.value.push(result)
      }
    } else {
      const result = await api.put<Order>('orders', savingOrder.id, savingOrder)
      if (result) {
        const index = orders.value.findIndex((el) => el.id === result.id)
        if (index > -1) {
          orders.value[index] = result
        }
      }
    }
    saving.value = false
    return true
  }

  const remove = async (removingOrder: Order) => {
    if (!removingOrder.id) return
    loading.value = true
    const result = await api.remove('orders', removingOrder.id)
    console.log('remove', result)
    if (result) {
      const index = orders.value.findIndex((el) => el === removingOrder)
      if (index > -1) {
        orders.value.splice(index, 1)
      }
    }
    loading.value = false
  }

  return { filters, loading, saving, order, orders, get, save, remove }
})
