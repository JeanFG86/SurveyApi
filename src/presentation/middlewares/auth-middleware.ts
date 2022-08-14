import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http'
import { HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) { }

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const account = await this.loadAccountByToken.load({ accessToken: accessToken, role: this.role })
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
