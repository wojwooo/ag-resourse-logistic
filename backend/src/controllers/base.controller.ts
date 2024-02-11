import { Request, Response } from 'express'

type Repository = any
export default class BaseController {
  name: string
  presentation: string
  repository: Repository
  constructor(repository: Repository, name: string, presentation: string) {
    this.name = name
    this.presentation = presentation
    this.repository = repository
  }
  async create(req: Request, res: Response) {
    try {
      const savedRecord = await this.repository.save(req.body)
      res.status(201).send(savedRecord)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        message: `Невозможно создать ${this.presentation}. Произошла внутренняя ошибка базы данных!`
      })
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const results = await this.repository.retrieveAll(req.query)

      res.status(200).send(results)
    } catch (err) {
      res.status(500).send({
        message: `Невозможно найти элементы ${this.presentation}. Произошла внутренняя ошибка базы данных!`
      })
    }
  }


  async update(req: Request, res: Response) {
    try {
      const savedRecord = await this.repository.update(req.params.id, req.body)
      res.status(201).send(savedRecord)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        message: `Невозможно обновить ${this.presentation} с id = ${req.params.id}. Произошла внутренняя ошибка базы данных!`
      })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const num = await this.repository.delete(req.params.id)
      if (num == 1) {
        res.status(204).send()
      } else {
        res.status(200).send({
          message: `Невозможно удалить ${this.presentation} с id = ${req.params.id}. Возможно запись уже была удалена!`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: `Невозможно удалить ${this.presentation} с id = ${req.params.id}. Произошла внутренняя ошибка базы данных!`
      })
    }
  }
}
