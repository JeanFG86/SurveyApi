import { loginPath } from '@/main/docs/paths'
import { badRequest, notFound, serverError, unauthorizedError } from '@/main/docs/components'
import { accoutSchema, errorSchema, loginParamsSchema } from '@/main/docs/schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'API para realizar enquetes!!',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC'
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
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorizedError,
    notFound
  }
}
