import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys'
import { adminAuth, auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
