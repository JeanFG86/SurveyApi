import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/usecases'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel | undefined> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true
    })
    if (res.value) {
      return {
        id: res.value?._id.toString(),
        surveyId: res.value?.surveyId,
        accountId: res.value?.accountId,
        answer: res.value?.answer,
        date: res.value?.date
      }
    }
  }
}
