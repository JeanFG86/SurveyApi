import { Decrypter } from '@/data/protocols/criptograpfy'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) { }

  async load (input: LoadAccountByToken.Params): Promise<LoadAccountByToken.Result> {
    let accessToken: string | undefined
    try {
      accessToken = await this.decrypter.decrypt(input.accessToken)
    } catch (error) {
      return undefined
    }

    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken({ accessToken: input.accessToken, role: input.role })
      if (account) {
        return account
      }
    }
    return await Promise.resolve(undefined)
  }
}
