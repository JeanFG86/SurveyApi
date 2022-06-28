import { HashComparer } from '@/data/protocols/criptograpfy'
import { LoadAccountByEmailRepository } from '@/data/protocols/db'
import { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer) { }

  async auth (input: Authentication.Input): Promise<Authentication.OutPut> {
    const account = await this.loadAccountByEmailRepository.load(input.email)
    if (account !== null) {
      await this.hashComparer.compare({
        value: input.password,
        hash: account.password
      })
    }
    return await new Promise(resolve => resolve({ token: undefined }))
  }
}
