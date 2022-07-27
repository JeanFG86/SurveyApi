import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultModel } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result'

describe('DbSaveSurveyResult UseCase', () => {
  let sut: DbSaveSurveyResult
  let fakeSurveyResult: SurveyResultModel
  let fakeSaveSurveyResult: SaveSurveyResultModel
  let fakeSaveSurveyResultRepository: MockProxy<SaveSurveyResultRepository>
  beforeAll(() => {
    MockDate.set(new Date())
    fakeSaveSurveyResult = {
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    fakeSurveyResult = Object.assign({}, fakeSaveSurveyResult, {
      id: 'any_id'
    })
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

  it('Should throw if SaveSurveyResultRepository throws', async () => {
    fakeSaveSurveyResultRepository.save.mockRejectedValueOnce(new Error())

    const promise = sut.save(fakeSaveSurveyResult)

    await expect(promise).rejects.toThrow()
  })

  it('Should return a surveyResult on success', async () => {
    const surveys = await sut.save(fakeSaveSurveyResult)

    expect(surveys).toEqual(fakeSurveyResult)
  })
})
