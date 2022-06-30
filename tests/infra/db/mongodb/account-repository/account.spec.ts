import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { Collection } from 'mongodb'

describe('Account Mongo Repository', () => {
  let accontCollection: Collection
  let sut: AccountMongoRepository
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new AccountMongoRepository()
    accontCollection = MongoHelper.getCollection('accounts')
    await accontCollection.deleteMany({})
  })

  it('Should return an account on add success', async () => {
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('any_password')
  })

  it('Should return an account on loadByEmail success', async () => {
    await accontCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.password).toBe('any_password')
  })

  it('Should return null if loadByEmail fails', async () => {
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })
})
