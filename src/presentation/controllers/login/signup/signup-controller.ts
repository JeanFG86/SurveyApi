import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http'
import { AddAccount, Authentication } from '@/domain/usecases'
import { EmailInUseError } from '@/presentation/errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const isValid = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const model = await this.authentication.auth({
        email, password
      })
      return ok(model)
    } catch (error) {
      return serverError(new Error())
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
