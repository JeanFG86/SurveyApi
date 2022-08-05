import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result'
import { DbLoadSurveyResult } from '@/data/usecases/load-survey-result'
import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbLoadSurveyResult UseCase', () => {
  let sut: DbLoadSurveyResult
  let fakeSurveyResult: SurveyResultModel
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyResultRepository: MockProxy<LoadSurveyResultRepository>
  let fakeLoadSurveyByIdRepository: MockProxy<LoadSurveyByIdRepository>

  beforeAll(() => {
    fakeSurveyResult = {
      surveyId: 'any_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        count: 0,
        percent: 0
      },
      {
        answer: 'other_answer',
        image: 'any_image',
        count: 0,
        percent: 0
      }],
      date: new Date()
    }
    fakeSurvey = {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer'
      },
      {
        answer: 'other_answer',
        image: 'any_image'
      }],
      date: new Date()
    }
    fakeLoadSurveyResultRepository = mock()
    fakeLoadSurveyResultRepository.loadBySurveyId.mockResolvedValue(fakeSurveyResult)
    fakeLoadSurveyByIdRepository = mock()
    fakeLoadSurveyByIdRepository.loadById.mockResolvedValue(fakeSurvey)
  })

  beforeEach(() => {
    sut = new DbLoadSurveyResult(fakeLoadSurveyResultRepository, fakeLoadSurveyByIdRepository)
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const loadBySurveyIdSpy = jest.spyOn(fakeLoadSurveyResultRepository, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should throw if LoadSurveyResultRepository throws', async () => {
    fakeLoadSurveyResultRepository.loadBySurveyId.mockRejectedValueOnce(new Error())

    const promise = sut.load('any_survey_id')

    await expect(promise).rejects.toThrow()
  })

  it('Should call a LoadSurveyByIdRepository if LoadSurveyResultRepository returns undefined', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyByIdRepository, 'loadById')
    fakeLoadSurveyResultRepository.loadBySurveyId.mockResolvedValueOnce(undefined)

    await sut.load('any_survey_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should return surveyResultModel if all answers count 0 if LoadSurveyResultRepository returns undefined', async () => {
    fakeLoadSurveyResultRepository.loadBySurveyId.mockResolvedValueOnce(undefined)

    const survey = await sut.load('any_id')

    await expect(survey).toEqual(fakeSurveyResult)
  })

  it('Should return surveyResultModel on success', async () => {
    const survey = await sut.load('any_survey_id')

    await expect(survey).toEqual(fakeSurveyResult)
  })
})
