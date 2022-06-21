import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.email) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!httpRequest.body?.password) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}