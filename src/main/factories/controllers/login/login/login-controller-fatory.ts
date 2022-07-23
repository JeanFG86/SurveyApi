import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { LoginController } from '@/presentation/controllers/login/login'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication } from '../../../usecases/account/authentication'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
