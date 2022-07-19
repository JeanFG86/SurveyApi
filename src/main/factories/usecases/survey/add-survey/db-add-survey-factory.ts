import { DbAddSurvey } from '@/data/usecases/add-survey'
import { AddSurvey } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
