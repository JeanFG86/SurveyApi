import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'

describe('Account Mongo Repository', () => {
  // let db: any
  let sut: AccountMongoRepository
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
    /*
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    */
    // db = await connection.db(globalThis.__MONGO_DB_NAME__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => {
    sut = new AccountMongoRepository()
  })

  it('Should return an account on success', async () => {
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
