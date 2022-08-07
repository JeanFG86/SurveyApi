import { LoadSurveyById } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const survey = await this.loadSurveyById.loadById(surveyId)
    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }

    return await Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
