import { HashComparer } from '@/data/protocols/criptograpfy'
import { LoadAccountByEmailRepository } from '@/data/protocols/db'
import { DbAuthentication } from '@/data/usecases/authentication'
import { Authentication } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAuthentication UseCase', () => {
  let sut: DbAuthentication
  let fakeHashCompare: MockProxy<HashComparer>
  let fakeLoadAccount: MockProxy<LoadAccountByEmailRepository>
  let fakeAuthentication: MockProxy<Authentication.Input>
  beforeAll(() => {
    fakeAuthentication = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    fakeLoadAccount = mock()
    fakeLoadAccount.load.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
    fakeHashCompare = mock()
    fakeHashCompare.compare.mockResolvedValue(true)
  })

  beforeEach(() => {
    sut = new DbAuthentication(fakeLoadAccount, fakeHashCompare)
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    await sut.auth(fakeAuthentication)

    expect(fakeLoadAccount.load).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository thorws', async () => {
    fakeLoadAccount.load.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  it('Should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    fakeLoadAccount.load.mockResolvedValueOnce(null)

    const accessToken = await sut.auth(fakeAuthentication)

    expect(accessToken.token).toBeUndefined()
  })

  it('Should call HashComparer with correct values', async () => {
    const conpareSpy = jest.spyOn(fakeHashCompare, 'compare')

    await sut.auth(fakeAuthentication)

    expect(conpareSpy).toHaveBeenLastCalledWith({ value: 'any_password', hash: 'hashed_password' })
  })

  it('Should throw if HashComparer thorws', async () => {
    fakeHashCompare.compare.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })
})
