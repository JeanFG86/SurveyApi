import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols/db/survey'
import { SurveyModel } from '@/domain/models'
import { AddSurveyModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return surveys as unknown as SurveyModel[]
  }
}
