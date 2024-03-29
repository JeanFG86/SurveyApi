import { LoadSurveysRepository } from '@/data/protocols/db/survey'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys'
import { SurveyModel } from '@/domain/models'

describe('DbLoadSurveys Usecase', () => {
  let sut: DbLoadSurveys
  let fakeSurveys: SurveyModel[]
  let fakeLoadSurveysRepository: MockProxy<LoadSurveysRepository>

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
    fakeLoadSurveysRepository = mock()
    fakeLoadSurveysRepository.loadAll.mockResolvedValue(fakeSurveys)
  })

  beforeEach(() => {
    sut = new DbLoadSurveys(fakeLoadSurveysRepository)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveysRepository', async () => {
    const loadAllSpy = jest.spyOn(fakeLoadSurveysRepository, 'loadAll')

    await sut.load('any_id')

    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return a list of Surveys on success', async () => {
    const surveys = await sut.load('any_id')

    expect(surveys).toEqual(fakeSurveys)
  })

  it('Should throw LoadSurveysRepository throws', async () => {
    fakeLoadSurveysRepository.loadAll.mockRejectedValueOnce(new Error())

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  })
})
