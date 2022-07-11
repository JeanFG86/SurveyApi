import { HttpRequest, Validation } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey'
import { mock, MockProxy } from 'jest-mock-extended'
import { badRequest, serverError } from '@/presentation/helpers/http'
import { AddSurvey } from '@/domain/usecases'

describe('AddSurvey Controller', () => {
  let sut: AddSurveyController
  let fakeRequest: HttpRequest
  let fakeValidation: MockProxy<Validation>
  let fakeAddSurvey: MockProxy<AddSurvey>
  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
    fakeAddSurvey = mock()
    // fakeAddSurvey.add.mockResolvedValue()
    fakeRequest = {
      body: {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }]
      }
    }
  })

  beforeEach(() => {
    sut = new AddSurveyController(fakeValidation, fakeAddSurvey)
  })

  it('Should call validation with correct values', async () => {
    const validateSpy = jest.spyOn(fakeValidation, 'validate')

    await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  it('should return 400 if validation fails', async () => {
    fakeValidation.validate.mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const addSpy = jest.spyOn(fakeAddSurvey, 'add')

    await sut.handle(fakeRequest)

    expect(addSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    fakeAddSurvey.add.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
