import { LoadAccountByEmailRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/usecases/authentication'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAuthentication UseCase', () => {
  let sut: DbAuthentication
  let fakeLoadAccount: MockProxy<LoadAccountByEmailRepository>
  beforeAll(() => {
    fakeLoadAccount = mock()
    fakeLoadAccount.load.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  beforeEach(() => {
    sut = new DbAuthentication(fakeLoadAccount)
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(fakeLoadAccount.load).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository thorws', async () => {
    fakeLoadAccount.load.mockRejectedValueOnce(new Error())

    const promise = sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    await expect(promise).rejects.toThrow()
  })
})
