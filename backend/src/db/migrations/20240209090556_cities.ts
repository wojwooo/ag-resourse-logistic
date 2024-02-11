import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('cities', function (table) {
      table.string('id', 5).notNullable()
      table.string('presentation', 255).notNullable()
      table.unique('id')
    })
    .createTable('orders', function (table) {
      table.increments('id')
      table.date('date').notNullable()
      table.string('status', 10).notNullable()
      table.string('cityFrom', 5).notNullable()
      table.string('addressFrom', 1024)
      table.string('contactsFrom', 1024)
      table.string('cityTo', 5).notNullable()
      table.string('addressTo', 1024)
      table.string('contactsTo', 1024)
      table.string('freight', 1024)
      table.integer('weight')

      //mock
      table.string('carMake', 100)
      table.string('regNumber', 12)
      table.integer('truckload')
      table.string('startPosition', 1024)
      table.date('startDatePlan')
      table.date('startDate')
      table.date('departureDatePlan')
      table.date('departureDate')
      table.date('arrivalDatePlan')
      table.date('arrivalDate')
      table.date('endDatePlan')
      table.date('endDate')
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('cities').dropTableIfExists('orders')
}
