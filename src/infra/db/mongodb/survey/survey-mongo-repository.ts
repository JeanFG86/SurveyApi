import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols/db/survey'
import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys as unknown as SurveyModel[]
  }

  async loadById (id: string): Promise<SurveyModel | undefined> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey as unknown as SurveyModel
  }
}
