import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
