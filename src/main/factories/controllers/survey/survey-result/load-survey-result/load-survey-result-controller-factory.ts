import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey/survey-result/load-survey-result'

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult()))
}
