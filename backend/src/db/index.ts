import { knex } from 'knex'
const filename = './src/db/data/db.sqlite'

export const db = knex({
  client: 'sqlite3',
  connection: {
    filename
  },
  useNullAsDefault: true
})