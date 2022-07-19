import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
