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
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      await this.loadSurveyByIdRepository.loadById(surveyId)
    }
    return surveyResult
  }
}
