import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { LogMongoRepository } from '@/infra/db/mongodb/log-repository'

describe('log Mongo Repository', () => {
  let sut: LogMongoRepository
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new LogMongoRepository()
    errorCollection = MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
