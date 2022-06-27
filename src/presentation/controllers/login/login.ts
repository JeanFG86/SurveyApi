import { Authentication } from '@/domain/usecases'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Validation } from '@/presentation/helpers/validators'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const { token } = await this.authentication.auth({
        email, password
      })
      if (token === undefined) {
        return unauthorized()
      }
      return ok({ accessToken: token })
    } catch (error) {
      return serverError(new Error())
    }
  }
}
