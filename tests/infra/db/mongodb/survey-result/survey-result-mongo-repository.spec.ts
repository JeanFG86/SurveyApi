import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection, ObjectId } from 'mongodb'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result'

describe('Survey Mongo Result Repository', () => {
  let surveyCollection: Collection
  let surveyResultCollection: Collection
  let accountCollection: Collection
  let sut: SurveyResultMongoRepository

  const makeSurvey = async (): Promise<SurveyModel | undefined> => {
    const res = await surveyCollection.insertOne({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer1'
      }, {
        answer: 'any_answer2'
      }, {
        answer: 'any_answer3'
      }],
      date: new Date()
    })

    const surveyResult = await surveyCollection.findOne(res.insertedId)

    if (surveyResult !== null) {
      const surveyReturn = {
        id: surveyResult._id.toString(),
        question: surveyResult.question.toString(),
        answers: surveyResult.answers,
        date: surveyResult.date
      }
      return surveyReturn
    }
  }

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
    sut = new SurveyResultMongoRepository()
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save', () => {
    it('Should add a survey result if its new', async () => {
      const survey = await makeSurvey()
      const accountId = await makeAccountId()
      await sut.save({
        date: new Date(),
        surveyId: survey!.id,
        accountId: accountId!,
        answer: survey!.answers[0].answer
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId!)
      })

      expect(surveyResult).toBeTruthy()
    })

    it('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const accountId = await makeAccountId()
      await surveyResultCollection.insertOne({
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId!),
        answer: survey!.answers[0].answer
      })
      await sut.save({
        date: new Date(),
        surveyId: survey!.id,
        accountId: accountId!,
        answer: survey!.answers[1].answer
      })

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey!.id),
          accountId: new ObjectId(accountId!)
        })
        .toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })

  describe('loadBySurveyId()', () => {
    it('Should load survey result', async () => {
      const survey = await makeSurvey()
      const accountId1 = await makeAccountId()
      const accountId2 = await makeAccountId()
      await surveyResultCollection.insertMany([{
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId1!),
        answer: survey!.answers[0].answer
      }, {
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId1!),
        answer: survey!.answers[1].answer
      }, {
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId2!),
        answer: survey!.answers[0].answer
      }, {
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId2!),
        answer: survey!.answers[1].answer
      }])

      const surveyResult = await sut.loadBySurveyId(survey!.id, accountId1!)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(2)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[2].count).toBe(0)
      expect(surveyResult?.answers[2].percent).toBe(0)
      expect(surveyResult?.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    it('Should load survey result 2', async () => {
      const survey = await makeSurvey()
      const accountId1 = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId1!),
        answer: survey!.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId2!),
        answer: survey!.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId3!),
        answer: survey!.answers[1].answer,
        date: new Date()
      }])

      const surveyResult = await sut.loadBySurveyId(survey!.id, accountId2!)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(66.66666666666666)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33.33333333333333)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers.length).toBe(survey!.answers.length)
    })

    it('Should load survey result 3', async () => {
      const survey = await makeSurvey()
      const accountId1 = await makeAccountId()
      const accountId2 = await makeAccountId()
      const accountId3 = await makeAccountId()
      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId1!),
        answer: survey!.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(accountId2!),
        answer: survey!.answers[1].answer,
        date: new Date()
      }])

      const surveyResult = await sut.loadBySurveyId(survey!.id, accountId3!)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey?.id)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers.length).toBe(survey!.answers.length)
    })

    it('Should return undefined if there is no survey result', async () => {
      const survey = await makeSurvey()
      const accountId1 = await makeAccountId()

      const surveyResult = await sut.loadBySurveyId(survey!.id, accountId1!)

      expect(surveyResult).toBeUndefined()
    })
  })
})
