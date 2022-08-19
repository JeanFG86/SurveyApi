import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result'
import { makeLoadAnswersBySurvey } from '@/main/factories/usecases/survey/load-survey-by-id'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey/survey-result/save-survey-result'

export const makeSaveSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new SaveSurveyResultController(makeLoadAnswersBySurvey(), makeDbSaveSurveyResult()))
}
