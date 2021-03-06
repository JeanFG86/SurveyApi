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

  it('Should add a survey on success', async () => {
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'any_answer2'
      }]
    })

    const survey = await surveyCollection.findOne({ question: 'any_question' })

    expect(survey).toBeTruthy()
  })
})
