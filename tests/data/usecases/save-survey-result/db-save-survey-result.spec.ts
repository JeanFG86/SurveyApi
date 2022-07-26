import { SaveSurveyResultRepository } from '@/data/protocols/db/survey'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from '@/data/usecases/save-survey-result'

describe('DbSaveSurveyResult UseCase', () => {
  let sut: DbSaveSurveyResult
  let fakeSurveyResult: SurveyResultModel
  let fakeSaveSurveyResult: SaveSurveyResultModel
  let fakeSaveSurveyResultRepository: MockProxy<SaveSurveyResultRepository>
  beforeAll(() => {
    MockDate.set(new Date())
    fakeSurveyResult = {
      id: 'any_id',
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    fakeSaveSurveyResult = {
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    fakeSaveSurveyResultRepository = mock()
    fakeSaveSurveyResultRepository.save.mockResolvedValue(fakeSurveyResult)
  })

  beforeEach(() => {
    sut = new DbSaveSurveyResult(fakeSaveSurveyResultRepository)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const saveSpy = jest.spyOn(fakeSaveSurveyResultRepository, 'save')

    await sut.save(fakeSaveSurveyResult)

    expect(saveSpy).toHaveBeenCalledWith(fakeSaveSurveyResult)
  })
})
