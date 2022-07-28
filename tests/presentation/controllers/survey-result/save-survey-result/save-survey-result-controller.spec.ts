import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'
import { HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('SaveSurveyResult Controller', () => {
  let sut: SaveSurveyResultController
  let fakeRequest: HttpRequest
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyById: MockProxy<LoadSurveyById>

  beforeAll(() => {
    MockDate.set(new Date())
    fakeLoadSurveyById = mock()
    fakeRequest = {
      params: {
        surveyId: 'any_survey_id'
      }
    }
    fakeSurvey = {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    fakeLoadSurveyById.loadById.mockResolvedValue(fakeSurvey)
  })

  beforeEach(() => {
    sut = new SaveSurveyResultController(fakeLoadSurveyById)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyById with correct values', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyById, 'loadById')

    await sut.handle(fakeRequest)

    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    fakeLoadSurveyById.loadById.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
