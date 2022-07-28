import { HashComparer, Encrypter } from '@/data/protocols/criptograpfy'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'
import { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository) { }

  async auth (input: Authentication.Input): Promise<Authentication.OutPut> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(input.email)
    if (account !== null) {
      const isValid = await this.hashComparer.compare({
        value: input.password,
        hash: account.password
      })
      if (isValid) {
        const token = await this.encrypter.encrypt({ value: account.id })
        await this.updateAccessTokenRepository.updateAccessToken({ id: account.id, token: token.token! })
        return token
      }
    }
    return await Promise.resolve({ token: undefined })
  }
}
