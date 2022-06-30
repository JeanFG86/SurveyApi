import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    if (account !== null) {
      const accountReturn = {
        id: account._id.toString(),
        name: account.name.toString(),
        email: account.email.toString(),
        password: account.password.toString()
      }
      return accountReturn
    }
    return null
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | undefined> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)

    if (account !== null) {
      const accountReturn = {
        id: account._id.toString(),
        name: account.name.toString(),
        email: account.email.toString(),
        password: account.password.toString()
      }
      return accountReturn
    }
  }
}
