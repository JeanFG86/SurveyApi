import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '../middlewares'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/survey-result/save-survey-result'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
