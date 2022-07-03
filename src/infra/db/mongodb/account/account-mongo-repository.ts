import { AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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

  async updateAccessToken (input: UpdateAccessTokenRepository.Input): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(input.id) },
      { $set: { accessToken: input.token } }
    )
  }
}
