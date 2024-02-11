import express, { Application } from 'express'
import Server from './server'

const app: Application = express()
new Server(app)
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

app
  .listen(PORT, 'localhost', function () {
    console.log(`Server is running on port ${PORT}.`)
  })
  .on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Error: address already in use')
    } else {
      console.log(err)
    }
  })
