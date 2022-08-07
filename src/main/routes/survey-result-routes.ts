import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '../middlewares'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/survey-result/save-survey-result'
import { makeLoadSurveyResultController } from '../factories/controllers/survey/survey-result/load-survey-result'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultController()))
}
