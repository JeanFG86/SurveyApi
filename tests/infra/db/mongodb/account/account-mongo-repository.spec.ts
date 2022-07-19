import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { AccountMongoRepository } from '@/infra/db/mongodb/account'
import { Collection } from 'mongodb'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  let sut: AccountMongoRepository
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new AccountMongoRepository()
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Add', () => {
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

  describe('LoadByEmail', () => {
    it('Should return an account on loadByEmail success', async () => {
      await accountCollection.insertOne({
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

  describe('UpdateAccessToken', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const fakeAccount = await accountCollection.findOne(res.insertedId)

      expect(fakeAccount?.accessToken).toBeFalsy()

      await sut.updateAccessToken({ id: fakeAccount!._id.toHexString(), token: 'any_token' })

      const account = await accountCollection.findOne({ _id: fakeAccount?._id })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })

  describe('LoadByToken', () => {
    it('Should return an account on LoadByToken without role', async () => {
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_token' })

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('Should return an account on LoadByToken with role', async () => {
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'any_role'
      })

      const account = await sut.loadByToken({ accessToken: 'any_token', role: 'any_role' })

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account?.name).toBe('any_name')
      expect(account?.email).toBe('any_email@mail.com')
      expect(account?.password).toBe('any_password')
    })

    it('Should return null if LoadByToken fails', async () => {
      const account = await sut.loadByToken({ accessToken: 'any_token' })

      expect(account).toBeFalsy()
    })
  })
})
