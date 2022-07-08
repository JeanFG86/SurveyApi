import { SignUpController } from '@/presentation/controllers/signup'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers/signup'
import { makeDbAuthentication } from '../../usecases/authentication'
import { makeDbAddAccount } from '../../usecases/add-account'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication()))
}
