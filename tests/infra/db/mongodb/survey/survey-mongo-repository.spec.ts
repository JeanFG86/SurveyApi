import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection, ObjectId } from 'mongodb'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  let sut: SurveyMongoRepository
  let surveyResultCollection: Collection
  let accountCollection: Collection

  const makeAccountId = async (): Promise<string | undefined> => {
    const result = await accountCollection.insertOne({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await accountCollection.findOne(result.insertedId)

    if (account !== null) {
      return account._id.toString()
    }
  }

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL!)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    sut = new SurveyMongoRepository()
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add', () => {
    it('Should add a survey on success', async () => {
      await sut.add({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'any_answer2'
        }],
        date: new Date()
      })

      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll', () => {
    it('Should loadAll surveys on success', async () => {
      const accountId = await makeAccountId()
      const result = await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'any_answer2'
        }],
        date: new Date()
      },
      {
        question: 'other_question',
        answers: [{
          image: 'any_image',
          answer: 'other_answer'
        }, {
          answer: 'other_answer2'
        }],
        date: new Date()
      }])
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne(
        {
          date: new Date(),
          surveyId: new ObjectId(survey!.id),
          accountId: new ObjectId(accountId),
          answer: survey!.answers[0].answer
        }
      )
      const surveys = await sut.loadAll(accountId!)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(false)
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    it('Should load empty list', async () => {
      const accountId = await makeAccountId()
      const surveys = await sut.loadAll(accountId!)

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById', () => {
    it('Should load by id survey on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })

      const survey = await sut.loadById(res.insertedId.toString())

      expect(survey).toBeTruthy()
    })

    it('Should return null if survey does not exists', async () => {
      const survey = await sut.loadById(new ObjectId().toHexString())

      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers', () => {
    it('Should load answers on success', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      })

      const answers = await sut.loadAnswers(res.insertedId.toString())

      expect(answers).toEqual(['any_answer', 'other_answer'])
    })

    it('Should return empty array if survey does not exists', async () => {
      const objectId = new ObjectId()
      const answers = await sut.loadAnswers(objectId.toHexString())

      expect(answers).toEqual([])
    })
  })

  describe('checkById', () => {
    it('Should return true if survey exists', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })

      const exists = await sut.checkById(res.insertedId.toString())

      expect(exists).toBeTruthy()
    })

    it('Should return true if survey exists', async () => {
      const objectId = new ObjectId()
      const exists = await sut.checkById(objectId.toHexString())

      expect(exists).toBeFalsy()
    })
  })
})
