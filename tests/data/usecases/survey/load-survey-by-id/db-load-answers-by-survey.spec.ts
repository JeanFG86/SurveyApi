import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey'
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-survey-by-id'

describe('DbLoadAnswersBySurvey', () => {
  let sut: DbLoadAnswersBySurvey
  let fakeSurvey: SurveyModel
  let fakeLoadAnswersBySurveyRepository: MockProxy<LoadAnswersBySurveyRepository>

  beforeAll(() => {
    MockDate.set(new Date())
    fakeSurvey = {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
    fakeLoadAnswersBySurveyRepository = mock()
    fakeLoadAnswersBySurveyRepository.loadAnswers.mockResolvedValue(['any_answer', 'other_answer'])
  })

  beforeEach(() => {
    sut = new DbLoadAnswersBySurvey(fakeLoadAnswersBySurveyRepository)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyByIdRepository with correct id', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadAnswersBySurveyRepository, 'loadAnswers')

    await sut.loadAnswers('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return answers on success', async () => {
    const answer = await sut.loadAnswers('any_id')

    expect(answer).toEqual([fakeSurvey.answers[0].answer, fakeSurvey.answers[1].answer])
  })

  it('Should return empty array if LoadSurveyByIdRepository returns []', async () => {
    fakeLoadAnswersBySurveyRepository.loadAnswers.mockResolvedValueOnce([])
    const answer = await sut.loadAnswers('any_id')

    expect(answer).toEqual([])
  })

  it('Should throw LoadSurveyByIdRepository throws', async () => {
    fakeLoadAnswersBySurveyRepository.loadAnswers.mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
