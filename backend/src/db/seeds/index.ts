import type { Knex } from 'knex'
import { cities, orders } from '../mocks'

export async function seed(knex: Knex) {
  await knex('cities').del()
  await knex('cities').insert(cities)

  await knex('orders').del()
  await knex('orders').insert(orders)
}
