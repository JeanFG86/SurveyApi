import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
