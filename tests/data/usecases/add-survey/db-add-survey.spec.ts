import { AddSurveyRepository } from '@/data/protocols/db/survey'
import { DbAddSurvey } from '@/data/usecases/add-survey'
import { AddSurveyModel } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAddSurvey UseCase', () => {
  let sut: DbAddSurvey
  let fakeSurveyData: AddSurveyModel
  let fakeAddSurveyRepository: MockProxy<AddSurveyRepository>
  beforeAll(() => {
    fakeSurveyData = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
    fakeAddSurveyRepository = mock()
  })

  beforeEach(() => {
    sut = new DbAddSurvey(fakeAddSurveyRepository)
  })

  it('Should call AddSurveyRepository with correct values', async () => {
    const addSpy = jest.spyOn(fakeAddSurveyRepository, 'add')

    await sut.add(fakeSurveyData)

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData)
  })

  it('Should throw if AddSurveyRepository throws', async () => {
    fakeAddSurveyRepository.add.mockRejectedValueOnce(new Error())

    const promise = sut.add(fakeSurveyData)

    await expect(promise).rejects.toThrow()
  })
})
