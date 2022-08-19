import { mock, MockProxy } from 'jest-mock-extended'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey'
import { DbCheckSurveyById } from '@/data/usecases/survey/load-survey-by-id'

describe('DbLoadSurveyById', () => {
  let sut: DbCheckSurveyById
  let fakeCheckSurveyByIdRepository: MockProxy<CheckSurveyByIdRepository>

  beforeAll(() => {
    fakeCheckSurveyByIdRepository = mock()
    fakeCheckSurveyByIdRepository.checkById.mockResolvedValue(true)
  })

  beforeEach(() => {
    sut = new DbCheckSurveyById(fakeCheckSurveyByIdRepository)
  })

  it('Should call CheckSurveyByIdRepository with correct id', async () => {
    const loadByIdSpy = jest.spyOn(fakeCheckSurveyByIdRepository, 'checkById')

    await sut.checkById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const exists = await sut.checkById('any_id')

    expect(exists).toBeTruthy()
  })

  it('Should return false if CheckSurveyByIdRepository returns false', async () => {
    fakeCheckSurveyByIdRepository.checkById.mockResolvedValueOnce(false)

    const exists = await sut.checkById('any_id')

    expect(exists).toBeFalsy()
  })

  it('Should throw CheckSurveyByIdRepository throws', async () => {
    fakeCheckSurveyByIdRepository.checkById.mockRejectedValueOnce(new Error())

    const promise = sut.checkById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
