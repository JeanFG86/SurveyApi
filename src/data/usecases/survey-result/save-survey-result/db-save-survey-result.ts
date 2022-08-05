import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository) { }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | undefined> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
