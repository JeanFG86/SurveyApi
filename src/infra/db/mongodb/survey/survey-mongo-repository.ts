import { AddSurveyRepository } from '@/data/protocols/db/survey'
import { AddSurveyModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
