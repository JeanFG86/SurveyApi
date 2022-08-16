import { Decrypter } from '@/data/protocols/criptograpfy'
import { mock, MockProxy } from 'jest-mock-extended'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account'

describe('DbLoadAccountByToken Usecase', () => {
  let sut: DbLoadAccountByToken
  let fakeDecrypter: MockProxy<Decrypter>
  let fakeLoadAccountRepository: MockProxy<LoadAccountByTokenRepository>
  beforeAll(() => {
    fakeDecrypter = mock()
    fakeDecrypter.decrypt.mockResolvedValue('any_token')
    fakeLoadAccountRepository = mock()
    fakeLoadAccountRepository.loadByToken.mockResolvedValue({ id: 'any_id' })
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

  it('Should throw Decrypter throws', async () => {
    fakeDecrypter.decrypt.mockRejectedValueOnce(new Error())

    const account = await sut.load({ accessToken: 'any_token', role: 'any_role' })

    await expect(account).toBeUndefined()
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

    expect(account).toEqual({ id: 'any_id' })
  })

  it('Should throw LoadAccountByTokenRepository throws', async () => {
    fakeLoadAccountRepository.loadByToken.mockRejectedValueOnce(new Error())

    const promise = sut.load({ accessToken: 'any_token', role: 'any_role' })

    await expect(promise).rejects.toThrow()
  })
})
