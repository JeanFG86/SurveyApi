import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result'

describe('DbSaveSurveyResult UseCase', () => {
  let sut: DbSaveSurveyResult
  let fakeSurveyResult: SurveyResultModel
  let fakeSaveSurveyResult: SaveSurveyResultParams
  let fakeSaveSurveyResultRepository: MockProxy<SaveSurveyResultRepository>
  let fakeLoadSurveyResultRepository: MockProxy<LoadSurveyResultRepository>
  beforeAll(() => {
    MockDate.set(new Date())
    fakeSaveSurveyResult = {
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    }
    fakeSurveyResult = {
      surveyId: 'any_survey_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        count: 1,
        percent: 50
      },
      {
        answer: 'other_answer',
        image: 'any_image',
        count: 2,
        percent: 20
      }],
      date: new Date()
    }
    fakeSaveSurveyResultRepository = mock()
    fakeSaveSurveyResultRepository.save.mockResolvedValue()
    fakeLoadSurveyResultRepository = mock()
    fakeLoadSurveyResultRepository.loadBySurveyId.mockResolvedValue(fakeSurveyResult)
  })

  beforeEach(() => {
    sut = new DbSaveSurveyResult(fakeSaveSurveyResultRepository, fakeLoadSurveyResultRepository)
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

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const loadBySurveyIdSpy = jest.spyOn(fakeLoadSurveyResultRepository, 'loadBySurveyId')

    await sut.save(fakeSaveSurveyResult)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(fakeSaveSurveyResult.surveyId)
  })

  it('Should return a surveyResult on success', async () => {
    const surveys = await sut.save(fakeSaveSurveyResult)

    expect(surveys).toEqual(fakeSurveyResult)
  })
})
