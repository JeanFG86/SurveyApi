import { Controller, HttpRequest, HttpResponse, EmailValidator } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'
import { AddAccount } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}
  handle (httpRequest: HttpRequest): HttpResponse | undefined {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
