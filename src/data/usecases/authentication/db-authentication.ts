import { HashComparer, TokenGenerator } from '@/data/protocols/criptograpfy'
import { LoadAccountByEmailRepository } from '@/data/protocols/db'
import { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator) { }

  async auth (input: Authentication.Input): Promise<Authentication.OutPut> {
    const account = await this.loadAccountByEmailRepository.load(input.email)
    if (account !== null) {
      const isValid = await this.hashComparer.compare({
        value: input.password,
        hash: account.password
      })
      if (isValid) {
        const token = await this.tokenGenerator.generate({ id: account.id })
        return token
      }
    }
    return await new Promise(resolve => resolve({ token: undefined }))
  }
}
