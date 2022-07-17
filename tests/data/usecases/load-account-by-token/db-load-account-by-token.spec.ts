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

    await sut.load({ accessToken: 'any_token' })

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
