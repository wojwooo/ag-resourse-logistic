import { Request } from 'express'
import { db } from './../db/index'

import { DateValueFormat, type Order, type Orders } from '@ag-resourse-logistic/core'
import dayjs from 'dayjs'

class OrdersRepository {
  async save(order: Order): Promise<Order> {
    const savingOrder = {
      ...order,
      date: order.date ? dayjs(order.date, DateValueFormat).toDate() : 0,
      status: 'draft' as const
    }
    const queryResult = await db('orders').insert(savingOrder)
    return {
      id: queryResult[0],
      ...savingOrder,
      date: dayjs(savingOrder.date).format(DateValueFormat)
    }
  }

  async update(paramsId: string, order: Order): Promise<Order> {
    const id: number = parseInt(paramsId)
    const queryResult = await db('orders').update(order).where('id', id)
    return {
      id: queryResult,
      ...order,
      date: dayjs(order.date).format(DateValueFormat)
    }
  }

  async delete(paramsId: string): Promise<number> {
    const id: number = parseInt(paramsId)
    const queryResult = await db('orders').delete().where('id', id)
    return queryResult
  }

  async retrieveAll(query: Request['query']): Promise<Orders> {
    const cityFrom = typeof query.cityFrom === 'string' ? query.cityFrom : undefined
    const cityTo = typeof query.cityTo === 'string' ? query.cityTo : undefined
    const status = typeof query.status === 'string' ? query.status : undefined

    const queryResult = await db('orders')
      .select('*')
      .modify((queryBuilder) => {
        cityFrom && queryBuilder.where('cityFrom', `${cityFrom}`)
        cityTo && queryBuilder.where('cityTo', `${cityTo}`)
        status && queryBuilder.where('status', `${status}`)
      })

    return queryResult?.map(
      (order: Record<string, any>) =>
        ({
          ...order,
          date: dayjs(order.date).format(DateValueFormat)
        }) as unknown as Order
    )
  }
}

export default new OrdersRepository()
