import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result'
import { HttpRequest } from '@/presentation/protocols'
import { forbidden, serverError } from '@/presentation/helpers/http'
import { InvalidParamError } from '@/presentation/errors'

describe('LoadSurveyResult Controller', () => {
  let sut: LoadSurveyResultController
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyById: MockProxy<LoadSurveyById>
  let fakeRequest: HttpRequest

  beforeAll(() => {
    MockDate.set(new Date())
    fakeLoadSurveyById = mock()
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
    fakeLoadSurveyById.loadById.mockResolvedValue(fakeSurvey)
  })

  beforeEach(() => {
    sut = new LoadSurveyResultController(fakeLoadSurveyById)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyById with correct values', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyById, 'loadById')

    await sut.handle(fakeRequest)

    expect(loadByIdSpy).toBeCalledWith('any_id')
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
})
