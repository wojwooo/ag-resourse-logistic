import BaseController from './base.controller'
import cityRepository from '../repositories/city.repository'

export default class CityController extends BaseController {
  constructor() {
    super(cityRepository, 'cities', 'Город')
  }
}
