import { AddSurveyRepository } from '@/data/protocols/db/survey'
import { DbAddSurvey } from '@/data/usecases/add-survey'
import { AddSurveyModel } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('DbAddSurvey UseCase', () => {
  let sut: DbAddSurvey
  let fakeSurveyData: AddSurveyModel
  let fakeAddSurveyRepository: MockProxy<AddSurveyRepository>
  beforeAll(() => {
    MockDate.set(new Date())
    fakeSurveyData = {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    fakeAddSurveyRepository = mock()
  })

  beforeEach(() => {
    sut = new DbAddSurvey(fakeAddSurveyRepository)
  })

  afterAll(() => {
    MockDate.reset()
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
