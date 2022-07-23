import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-surveys'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export const makeLoadSurveysController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveysController(makeDbLoadSurveys()))
}
