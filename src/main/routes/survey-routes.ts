import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey'
import { makeAuthMidlleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMidlleware('admin'))
  const auth = adaptMiddleware(makeAuthMidlleware())
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
