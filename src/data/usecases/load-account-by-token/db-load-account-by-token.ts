import { Decrypter } from '@/data/protocols/criptograpfy'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'
import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (input: LoadAccountByToken.Input): Promise<AccountModel | undefined> {
    const accessToken = await this.decrypter.decrypt(input.accessToken)
    if (accessToken) {
      await this.loadAccountByTokenRepository.loadByToken({ accessToken: accessToken, role: input.role })
    }
    return await new Promise(resolve => resolve(undefined))
  }
}
