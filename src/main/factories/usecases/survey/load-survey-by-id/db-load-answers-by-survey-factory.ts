import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-survey-by-id'
import { LoadAnswersBySurvey } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey'

export const makeLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
