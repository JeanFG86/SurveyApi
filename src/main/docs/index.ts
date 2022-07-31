import { loginPath, surveyPath, signUpPath, surveyResultPath } from '@/main/docs/paths'
import { badRequest, notFound, serverError, unauthorizedError, forbidden } from '@/main/docs/components'
import {
  accoutSchema, errorSchema, loginParamsSchema, surveyAnswerSchema,
  surveySchema, surveysSchema, apiKeyAuthSchema, signUpParamsSchema,
  addSurveyParamsSchema, saveSurveyParamsSchema, surveyResultSchema
} from '@/main/docs/schemas'

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
  },
  {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accoutSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    addSurveyParams: addSurveyParamsSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorizedError,
    notFound,
    forbidden
  }
}
