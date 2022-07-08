import { LogMongoRepository } from '@/infra/db/mongodb/log'
import { LogControllerDecorator } from '@/main/decorators'
import { Controller } from '@/presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
