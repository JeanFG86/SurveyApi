import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey'
import { makeAuthMidlleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMidlleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
