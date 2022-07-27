import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols/middleware'
import { makeDbLoadAccountByToken } from '@/main/factories/usecases/account/load-account-by-token'

export const makeAuthMidlleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
