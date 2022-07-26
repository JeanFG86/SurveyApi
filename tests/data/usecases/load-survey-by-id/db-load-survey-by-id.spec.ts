import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'
import { DbLoadSurveyById } from '@/data/usecases/load-survey-by-id'

describe('DbLoadSurveyById', () => {
  let sut: DbLoadSurveyById
  let fakeSurvey: SurveyModel
  let fakeLoadSurveyByIdRepository: MockProxy<LoadSurveyByIdRepository>

  beforeAll(() => {
    MockDate.set(new Date())
    fakeSurvey = {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
    fakeLoadSurveyByIdRepository = mock()
    fakeLoadSurveyByIdRepository.loadById.mockResolvedValue(fakeSurvey)
  })

  beforeEach(() => {
    sut = new DbLoadSurveyById(fakeLoadSurveyByIdRepository)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyByIdRepository with correct id', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyByIdRepository, 'loadById')

    await sut.loadById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return a survey on success', async () => {
    const surveys = await sut.loadById('any_id')

    expect(surveys).toEqual(fakeSurvey)
  })

  it('Should throw LoadSurveyByIdRepository throws', async () => {
    fakeLoadSurveyByIdRepository.loadById.mockRejectedValueOnce(new Error())

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
