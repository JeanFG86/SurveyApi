import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db/account'
import { Hasher } from '@/data/protocols/criptograpfy'
import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountModel } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccountModel): Promise<AccountModel | undefined> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    const hashedPassword = await this.encrypter.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
