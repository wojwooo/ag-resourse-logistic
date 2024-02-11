import BaseController from './base.controller'
import ordersRepository from '../repositories/orders.repository'

export default class CityController extends BaseController {
  constructor() {
    super(ordersRepository, 'orders', 'Заказ на доставку')
  }
}
