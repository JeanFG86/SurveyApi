import { AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  CheckAccountByEmailRepository {
  async loadByToken (input: LoadAccountByTokenRepository.Input): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        accessToken: input.accessToken,
        $or: [{
          role: input.role
        }, {
          role: 'admin'
        }]
      }, {
        projection: {
          _id: 1
        }
      })
    if (account !== null) {
      const accountReturn = {
        id: account._id.toString()
      }
      return accountReturn
    }
    return null
  }

  async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result | undefined> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne(result.insertedId)

    return account !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email
      }, {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      })
    if (account !== null) {
      const accountReturn = {
        id: account._id.toString(),
        name: account.name.toString(),
        password: account.password.toString()
      }
      return accountReturn
    }
    return null
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(
      {
        email
      }, {
        projection: {
          _id: 1
        }
      })

    return account !== null
  }

  async updateAccessToken (input: UpdateAccessTokenRepository.Input): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: new ObjectId(input.id) },
      { $set: { accessToken: input.token } }
    )
  }
}
