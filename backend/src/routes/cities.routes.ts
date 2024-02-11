import { Router } from 'express'
import CityController from '../controllers/city.controller'

class CitiesRoutes {
  router = Router()
  controller = new CityController()
  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.post('/', this.controller.create.bind(this.controller))
    this.router.get('/', this.controller.findAll.bind(this.controller))
    this.router.put('/:id', this.controller.update.bind(this.controller))
    this.router.delete('/:id', this.controller.delete.bind(this.controller))
  }
}

export default new CitiesRoutes().router
