import { AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'
import { Hasher } from '@/data/protocols/criptograpfy'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository) { }

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result | undefined> {
    const exists = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)
    if (!exists) {
      const hashedPassword = await this.encrypter.hash(accountData.password)
      const isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return isValid
    }
    return undefined
  }
}
