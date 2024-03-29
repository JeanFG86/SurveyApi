import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account'
import env from '@/main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
