import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db/account'
import { Hasher } from '@/data/protocols/criptograpfy'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result | undefined> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!account) {
      const hashedPassword = await this.encrypter.hash(accountData.password)
      const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return newAccount !== null
    }
    return undefined
  }
}
