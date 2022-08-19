import { SurveyResultModel } from '@/domain/models'
import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { mock, MockProxy } from 'jest-mock-extended'

describe('SaveSurveyResult Controller', () => {
  let sut: SaveSurveyResultController
  let fakeRequest: SaveSurveyResultController.Request
  let fakeSurveyResultModel: SurveyResultModel
  let fakeLoadAnswersBySurvey: MockProxy<LoadAnswersBySurvey>
  let fakeSaveSurveyResult: MockProxy<SaveSurveyResult>

  beforeAll(() => {
    fakeLoadAnswersBySurvey = mock()
    fakeSaveSurveyResult = mock()
    fakeRequest = {
      surveyId: 'any_survey_id',
      answer: 'any_answer',
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
    fakeLoadAnswersBySurvey.loadAnswers.mockResolvedValue(['any_answer', 'other_answer'])
    fakeSaveSurveyResult.save.mockResolvedValue(fakeSurveyResultModel)
  })

  beforeEach(() => {
    sut = new SaveSurveyResultController(fakeLoadAnswersBySurvey, fakeSaveSurveyResult)
  })

  it('Should call LoadAnswersBySurvey with correct values', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadAnswersBySurvey, 'loadAnswers')

    await sut.handle(fakeRequest)

    expect(loadByIdSpy).toBeCalledWith('any_survey_id')
  })

  it('Should return 403 if LoadSurveyById returns undefined', async () => {
    fakeLoadAnswersBySurvey.loadAnswers.mockResolvedValueOnce([])

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    fakeLoadAnswersBySurvey.loadAnswers.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 403 if and invalid answer is provided', async () => {
    const httpResponse = await sut.handle({
      surveyId: 'any_survey_id',
      accountId: 'any_id',
      answer: 'wrong_answer'
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
