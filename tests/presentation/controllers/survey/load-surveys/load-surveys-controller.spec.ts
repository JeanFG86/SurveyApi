import { SurveyModel } from '@/domain/models'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys'
import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'

describe('LoadSurveys Controller', () => {
  let sut: LoadSurveysController
  let fakeLoadSurveys: MockProxy<LoadSurveys>
  let fakeSurveys: SurveyModel[]

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
    fakeLoadSurveys = mock()
    fakeLoadSurveys.load.mockResolvedValue(fakeSurveys)
  })

  beforeEach(() => {
    sut = new LoadSurveysController(fakeLoadSurveys)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveys', async () => {
    const loadSpy = jest.spyOn(fakeLoadSurveys, 'load')

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })
})
