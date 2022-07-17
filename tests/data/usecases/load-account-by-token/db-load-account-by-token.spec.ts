import { Decrypter } from '@/data/protocols/criptograpfy'
import { mock, MockProxy } from 'jest-mock-extended'
import { DbLoadAccountByToken } from '@/data/usecases/load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  let sut: DbLoadAccountByToken
  let fakeDecrypter: MockProxy<Decrypter>
  beforeAll(() => {
    fakeDecrypter = mock()
    fakeDecrypter.decrypt.mockResolvedValue('any_value')
  })

  beforeEach(() => {
    sut = new DbLoadAccountByToken(fakeDecrypter)
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
})
