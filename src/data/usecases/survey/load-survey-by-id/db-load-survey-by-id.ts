import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<LoadSurveyById.Result> {
    return await this.loadSurveyByIdRepository.loadById(id)
  }
}
