import { mock, MockProxy } from 'jest-mock-extended'
import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey'
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-survey-by-id'

describe('DbLoadAnswersBySurvey', () => {
  let sut: DbLoadAnswersBySurvey
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
      },
      {
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }
    fakeLoadSurveyByIdRepository = mock()
    fakeLoadSurveyByIdRepository.loadById.mockResolvedValue(fakeSurvey)
  })

  beforeEach(() => {
    sut = new DbLoadAnswersBySurvey(fakeLoadSurveyByIdRepository)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyByIdRepository with correct id', async () => {
    const loadByIdSpy = jest.spyOn(fakeLoadSurveyByIdRepository, 'loadById')

    await sut.loadAnswers('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return answers on success', async () => {
    const answer = await sut.loadAnswers('any_id')

    expect(answer).toEqual([fakeSurvey.answers[0].answer, fakeSurvey.answers[1].answer])
  })

  it('Should return empty array if LoadSurveyByIdRepository returns undefined', async () => {
    fakeLoadSurveyByIdRepository.loadById.mockResolvedValueOnce(undefined)
    const answer = await sut.loadAnswers('any_id')

    expect(answer).toEqual([])
  })

  it('Should throw LoadSurveyByIdRepository throws', async () => {
    fakeLoadSurveyByIdRepository.loadById.mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
