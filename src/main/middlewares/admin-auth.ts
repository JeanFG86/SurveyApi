import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMidlleware } from '@/main/factories/middlewares'

export const adminAuth = adaptMiddleware(makeAuthMidlleware('admin'))
