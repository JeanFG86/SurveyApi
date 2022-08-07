import { LoadSurveyById } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    await this.loadSurveyById.loadById(surveyId)
    return await Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
