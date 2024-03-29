import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys'
import { noContent, ok, serverError } from '@/presentation/helpers/http'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('LoadSurveys Controller', () => {
  let sut: LoadSurveysController
  let fakeLoadSurveys: MockProxy<LoadSurveys>
  let fakeSurveys: SurveyModel[]
  let fakeRequest: LoadSurveysController.Request

  beforeAll(() => {
    MockDate.set(new Date())
    fakeSurveys = [{
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }, {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }]
    fakeLoadSurveys = mock()
    fakeLoadSurveys.load.mockResolvedValue(fakeSurveys)
    fakeRequest = {
      accountId: 'any_id'
    }
  })

  beforeEach(() => {
    sut = new LoadSurveysController(fakeLoadSurveys)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys with correct values', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveys, 'load')

    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenCalledWith(fakeRequest.accountId)
  })

  it('Should returns 200 on success', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok(fakeSurveys))
  })

  it('Should returns 204 if LoadSurveys returns empty', async () => {
    fakeLoadSurveys.load.mockResolvedValueOnce([])

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 500 if LoadSurveys throws', async () => {
    fakeLoadSurveys.load.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
