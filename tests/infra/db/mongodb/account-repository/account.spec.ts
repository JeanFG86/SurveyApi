import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'

describe('Account Mongo Repository', () => {
  let sut: AccountMongoRepository
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new AccountMongoRepository()
    const accontCollection = MongoHelper.getCollection('accounts')
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
})
