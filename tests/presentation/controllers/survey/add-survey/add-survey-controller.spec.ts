import { HttpRequest, Validation } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey'
import { mock, MockProxy } from 'jest-mock-extended'

describe('AddSurvey Controller', () => {
  let sut: AddSurveyController
  let fakeRequest: HttpRequest
  let fakeValidation: MockProxy<Validation>
  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
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
    sut = new AddSurveyController(fakeValidation)
  })

  it('Should call validation with correct values', async () => {
    const validateSpy = jest.spyOn(fakeValidation, 'validate')

    await sut.handle(fakeRequest)
    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })
})
