import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey'
import { Controller } from '@/presentation/protocols'
import { makeDbAddSurvey } from '../../../usecases/survey/add-survey'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()))
}
