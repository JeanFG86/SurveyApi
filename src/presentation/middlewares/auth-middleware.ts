import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly oadAccountByToken: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.oadAccountByToken.load({ accessToken: accessToken })
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
