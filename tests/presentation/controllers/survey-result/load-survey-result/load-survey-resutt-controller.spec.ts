import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, serverError } from '@/presentation/helpers/http'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

describe('LoadSurveyResult Controller', () => {
  let sut: LoadSurveyResultController
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyById: MockProxy<LoadSurveyById>
  let fakeLoadSurveyResult: MockProxy<LoadSurveyResult>
  let fakeRequest: HttpRequest
  let fakeSurveyResultModel: SurveyResultModel

  beforeAll(() => {
    MockDate.set(new Date())
    fakeLoadSurveyById = mock()
    fakeLoadSurveyResult = mock()
    fakeSurvey = {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    fakeRequest = {
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'any_answer'
      },
      accountId: 'any_account_id'
    }
    fakeSurveyResultModel = {
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
    fakeLoadSurveyById.loadById.mockResolvedValue(fakeSurvey)
    fakeLoadSurveyResult.load.mockResolvedValue(fakeSurveyResultModel)
  })

  beforeEach(() => {
    sut = new LoadSurveyResultController(fakeLoadSurveyById, fakeLoadSurveyResult)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyById with correct values', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyById, 'loadById')

    await sut.handle(fakeRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 403 if LoadSurveyById returns undefined', async () => {
    fakeLoadSurveyById.loadById.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    fakeLoadSurveyById.loadById.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call LoadSurveyResult with correct values', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveyResult, 'load')

    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 500 if LoadSurveyResult throws', async () => {
    fakeLoadSurveyResult.load.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
