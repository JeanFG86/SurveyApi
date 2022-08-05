import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load (surveyId: string): Promise<SurveyResultModel | undefined> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      if (survey) {
        surveyResult = {
          surveyId: surveyId,
          question: survey?.question,
          date: survey?.date,
          answers: survey?.answers.map(answer => Object.assign({}, answer, {
            count: 0,
            percent: 0
          }))
        }
      }
    }
    return surveyResult
  }
}
