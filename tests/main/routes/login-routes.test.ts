import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
  let accontCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accontCollection = MongoHelper.getCollection('accounts')
    await accontCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Jean',
          email: 'jean@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = await hash('123', 12)

      await accontCollection.insertOne({
        name: 'Jean',
        email: 'jean@gmail.com',
        password: password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'jean@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    it('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'jean@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
