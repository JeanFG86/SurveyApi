import { AccountModel, SurveyModel } from '@/domain/models'
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
        answer: 'any_answer'
      }, {
        answer: 'any_answer2'
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

  const makeAccount = async (): Promise<AccountModel | undefined> => {
    const result = await accountCollection.insertOne({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    const account = await accountCollection.findOne(result.insertedId)

    if (account !== null) {
      const accountReturn = {
        id: account._id.toString(),
        name: account.name.toString(),
        email: account.email.toString(),
        password: account.password.toString()
      }
      return accountReturn
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
      const account = await makeAccount()
      await sut.save({
        date: new Date(),
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[0].answer
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(account!.id)
      })

      expect(surveyResult).toBeTruthy()
    })

    it('Should update survey result if its not new', async () => {
      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        date: new Date(),
        surveyId: new ObjectId(survey!.id),
        accountId: new ObjectId(account!.id),
        answer: survey!.answers[0].answer
      })
      await sut.save({
        date: new Date(),
        surveyId: survey!.id,
        accountId: account!.id,
        answer: survey!.answers[1].answer
      })

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey!.id),
          accountId: new ObjectId(account!.id)
        })
        .toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
    })
  })
})
