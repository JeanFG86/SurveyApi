import { Router } from 'express'
import { makeSignUpController } from '@/main/factories/signup'
import { adaptRoute } from '@/main/adapters/express'
import { makeLoginController } from '@/main/factories/login'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
