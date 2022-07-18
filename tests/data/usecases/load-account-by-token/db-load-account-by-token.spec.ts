import { Decrypter } from '@/data/protocols/criptograpfy'
import { mock, MockProxy } from 'jest-mock-extended'
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token'
import { AccountModel } from '@/domain/models'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'

describe('DbLoadAccountByToken Usecase', () => {
  let sut: DbLoadAccountByToken
  let fakeDecrypter: MockProxy<Decrypter>
  let fakeLoadAccountRepository: MockProxy<LoadAccountByTokenRepository>
  let fakeAccount: MockProxy<AccountModel>
  beforeAll(() => {
    fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    fakeDecrypter = mock()
    fakeDecrypter.decrypt.mockResolvedValue('any_token')
    fakeLoadAccountRepository = mock()
    fakeLoadAccountRepository.loadByToken.mockResolvedValue(fakeAccount)
  })

  beforeEach(() => {
    sut = new DbLoadAccountByToken(fakeDecrypter, fakeLoadAccountRepository)
  })

  it('Should call Decrypter with correct values', async () => {
    const decryptSpy = jest.spyOn(fakeDecrypter, 'decrypt')

    await sut.load({ accessToken: 'any_token', role: 'any_role' })

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return undefined if Decrypter returns undefined', async () => {
    fakeDecrypter.decrypt.mockResolvedValueOnce(undefined)

    const account = await sut.load({ accessToken: 'any_token', role: 'any_role' })

    expect(account).toBeUndefined()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const loadByTokenSpy = jest.spyOn(fakeLoadAccountRepository, 'loadByToken')

    await sut.load({ accessToken: 'any_token', role: 'any_role' })

    expect(loadByTokenSpy).toHaveBeenCalledWith({ accessToken: 'any_token', role: 'any_role' })
  })

  it('Should return undefined if LoadAccountByTokenRepository returns null', async () => {
    fakeLoadAccountRepository.loadByToken.mockResolvedValueOnce(null)

    const account = await sut.load({ accessToken: 'any_token', role: 'any_role' })

    expect(account).toBeUndefined()
  })

  it('Should return an account on success', async () => {
    const account = await sut.load({ accessToken: 'any_token', role: 'any_role' })

    expect(account).toEqual(fakeAccount)
  })
})
