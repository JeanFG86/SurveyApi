import { LoadSurveyById } from '@/domain/usecases'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      await this.loadSurveyResult.load(surveyId)

      return await Promise.resolve({
        statusCode: 200,
        body: {}
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
