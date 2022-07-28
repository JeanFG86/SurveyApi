import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection

/*
const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Jean',
    email: 'jeanfg86@gmail.com',
    password: '123',
    role: 'admin'
  })

  const id = res.insertedId
  const _token = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne(
    { _id: id },
    { $set: { accessToken: _token } }
  )

  return _token
}
*/

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
