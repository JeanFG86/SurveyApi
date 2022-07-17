import { Decrypter } from '@/data/protocols/criptograpfy'
import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter) {}
  async load (input: LoadAccountByToken.Input): Promise<AccountModel | undefined> {
    await this.decrypter.decrypt(input.accessToken)
    return await new Promise(resolve => resolve(undefined))
  }
}
