import { Router } from 'express'
import OrdersController from '../controllers/orders.controller'

class OrdersRoutes {
  router = Router()
  controller = new OrdersController()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.post('/', this.controller.create.bind(this.controller))
    this.router.delete('/:id', this.controller.delete.bind(this.controller))
    this.router.get('/', this.controller.findAll.bind(this.controller))
    this.router.put('/:id', this.controller.update.bind(this.controller))
  }
}

export default new OrdersRoutes().router
