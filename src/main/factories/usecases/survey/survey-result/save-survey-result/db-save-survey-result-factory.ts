import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}
