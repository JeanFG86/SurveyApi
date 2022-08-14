import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result'
import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import MockDate from 'mockdate'

describe('LoadSurveyResult Controller', () => {
  let sut: LoadSurveyResultController
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyById: MockProxy<LoadSurveyById>
  let fakeLoadSurveyResult: MockProxy<LoadSurveyResult>
  let fakeRequest: LoadSurveyResultController.Request
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
      surveyId: 'any_id',
      accountId: 'any_account_id'
    }
    fakeSurveyResultModel = {
      surveyId: 'any_survey_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        count: 1,
        percent: 50,
        isCurrentAccountAnswer: false
      },
      {
        answer: 'other_answer',
        image: 'any_image',
        count: 2,
        percent: 20,
        isCurrentAccountAnswer: false
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

    expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.surveyId)
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

    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.surveyId, fakeRequest.accountId)
  })

  it('Should return 500 if LoadSurveyResult throws', async () => {
    fakeLoadSurveyResult.load.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok(fakeSurveyResultModel))
  })
})
