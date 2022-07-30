import { loginPath } from '../docs/paths/login-paths'
import { accoutSchema } from './schemas/account-schema'
import { loginParamsSchema } from './schemas/login-params-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'API para realizar enquetes!!',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accoutSchema,
    loginParams: loginParamsSchema
  }
}
