import { LoadSurveysRepository } from '@/data/protocols/db/survey'
import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}
  async load (): Promise<SurveyModel[] | undefined> {
    return await this.loadSurveysRepository.loadAll()
  }
}
