import { Validation } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey'
import { mock, MockProxy } from 'jest-mock-extended'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import { AddSurvey } from '@/domain/usecases'
import MockDate from 'mockdate'

describe('AddSurvey Controller', () => {
  let sut: AddSurveyController
  let fakeRequest: AddSurveyController.Request
  let fakeValidation: MockProxy<Validation>
  let fakeAddSurvey: MockProxy<AddSurvey>
  beforeAll(() => {
    MockDate.set(new Date())
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
    fakeAddSurvey = mock()
    fakeRequest = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  })

  beforeEach(() => {
    sut = new AddSurveyController(fakeValidation, fakeAddSurvey)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call validation with correct values', async () => {
    const validateSpy = jest.spyOn(fakeValidation, 'validate')

    await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest)
  })

  it('should return 400 if validation fails', async () => {
    fakeValidation.validate.mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const addSpy = jest.spyOn(fakeAddSurvey, 'add')

    await sut.handle(fakeRequest)

    expect(addSpy).toHaveBeenCalledWith({ ...fakeRequest, date: new Date() })
  })

  it('Should return 500 if AddSurvey throws', async () => {
    fakeAddSurvey.add.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if AddSurvey success', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(noContent())
  })
})
