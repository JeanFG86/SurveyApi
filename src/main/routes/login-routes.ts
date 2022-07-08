import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express'
import { makeSignUpController } from '../factories/controllers/signup'
import { makeLoginController } from '../factories/controllers/login'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
