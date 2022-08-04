import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result'
import { SurveyResultModel } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbLoadSurveyResult UseCase', () => {
  let sut: DbLoadSurveyResult
  let fakeSurveyResult: SurveyResultModel
  let fakeLoadSurveyResultRepository: MockProxy<LoadSurveyResultRepository>

  beforeAll(() => {
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
    fakeLoadSurveyResultRepository = mock()
    fakeLoadSurveyResultRepository.loadBySurveyId.mockResolvedValue(fakeSurveyResult)
  })

  beforeEach(() => {
    sut = new DbLoadSurveyResult(fakeLoadSurveyResultRepository)
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const loadBySurveyIdSpy = jest.spyOn(fakeLoadSurveyResultRepository, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    fakeLoadSurveyResultRepository.loadBySurveyId.mockRejectedValueOnce(new Error())

    const promise = sut.load('')

    await expect(promise).rejects.toThrow()
  })
})
