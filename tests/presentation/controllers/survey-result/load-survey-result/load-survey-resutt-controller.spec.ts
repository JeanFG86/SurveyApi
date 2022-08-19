import { SurveyResultModel } from '@/domain/models'
import { CheckSurveyById } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result'
import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { InvalidParamError } from '@/presentation/errors'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import MockDate from 'mockdate'

describe('LoadSurveyResult Controller', () => {
  let sut: LoadSurveyResultController
  let fakeCheckSurveyById: MockProxy<CheckSurveyById>
  let fakeLoadSurveyResult: MockProxy<LoadSurveyResult>
  let fakeRequest: LoadSurveyResultController.Request
  let fakeSurveyResultModel: SurveyResultModel

  beforeAll(() => {
    MockDate.set(new Date())
    fakeCheckSurveyById = mock()
    fakeLoadSurveyResult = mock()
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
    fakeCheckSurveyById.checkById.mockResolvedValue(true)
    fakeLoadSurveyResult.load.mockResolvedValue(fakeSurveyResultModel)
  })

  beforeEach(() => {
    sut = new LoadSurveyResultController(fakeCheckSurveyById, fakeLoadSurveyResult)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call CheckSurveyById with correct values', async () => {
    const loadByIdSpy = jest.spyOn(fakeCheckSurveyById, 'checkById')

    await sut.handle(fakeRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith(fakeRequest.surveyId)
  })

  it('Should return 403 if CheckSurveyById returns false', async () => {
    fakeCheckSurveyById.checkById.mockResolvedValueOnce(false)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if CheckSurveyById throws', async () => {
    fakeCheckSurveyById.checkById.mockRejectedValueOnce(new Error())

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
