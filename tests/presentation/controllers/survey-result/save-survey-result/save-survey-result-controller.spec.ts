import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('SaveSurveyResult Controller', () => {
  let sut: SaveSurveyResultController
  let fakeRequest: HttpRequest
  let fakeSurvey: SurveyModel
  let fakeSurveyResultModel: SurveyResultModel
  let fakeLoadSurveyById: MockProxy<LoadSurveyById>
  let fakeSaveSurveyResult: MockProxy<SaveSurveyResult>

  beforeAll(() => {
    MockDate.set(new Date())
    fakeLoadSurveyById = mock()
    fakeSaveSurveyResult = mock()
    fakeRequest = {
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'any_answer'
      },
      accountId: 'any_account_id'
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
    fakeSurveyResultModel = {
      id: 'valid_id',
      surveyId: 'valid_survey_id',
      accountId: 'valid_account_id',
      answer: 'valid_answer',
      date: new Date()
    }
    fakeLoadSurveyById.loadById.mockResolvedValue(fakeSurvey)
    fakeSaveSurveyResult.save.mockResolvedValue(fakeSurveyResultModel)
  })

  beforeEach(() => {
    sut = new SaveSurveyResultController(fakeLoadSurveyById, fakeSaveSurveyResult)
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

  it('Should return 500 if LoadSurveyById throws', async () => {
    fakeLoadSurveyById.loadById.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 403 if and invalid answer is provided', async () => {
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const saveSpy = jest.spyOn(fakeSaveSurveyResult, 'save')

    await sut.handle(fakeRequest)

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    fakeSaveSurveyResult.save.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok(fakeSurveyResultModel))
  })
})
