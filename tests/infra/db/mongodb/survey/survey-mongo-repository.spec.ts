import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection
  let sut: SurveyMongoRepository
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
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      },
      {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])
      const surveys = await sut.loadAll()

      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })
})
