import { Encrypter } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'

export class DbAddAccount {
  constructor (private readonly encrypter: Encrypter) {}
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    await this.encrypter.encrypt(account.password)
    // return new Promise()
    return await new Promise(resolve => resolve(null))
  }
}
