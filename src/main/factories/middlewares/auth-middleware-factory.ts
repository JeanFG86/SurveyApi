import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols/middleware'
import { makeDbLoadAccountByToken } from '../usecases/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMidlleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
