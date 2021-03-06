import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'

jest.mock('jsonwebtoken')

describe('JWT Adapter', () => {
  let sut: JwtAdapter
  let fakeJwt: jest.Mocked<typeof jwt>
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtAdapter('secret')
  })

  describe('sign()', () => {
    it('Should call sign with correct values', async () => {
      const signSpy = jest.spyOn(fakeJwt, 'sign')

      await sut.encrypt({ value: 'any_id' })

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('Should return a token on sign success', async () => {
      fakeJwt.sign.mockImplementationOnce(() => 'any_token')

      const accessToken = await sut.encrypt({ value: 'any_id' })

      expect(accessToken).toEqual({ token: 'any_token' })
    })

    it('Should throw if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.encrypt({ value: 'any_id' })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })

  describe('verify()', () => {
    it('Should call verify with correct values', async () => {
      const verifySpy = jest.spyOn(fakeJwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    it('Should return a value on verify success', async () => {
      fakeJwt.verify.mockImplementationOnce(() => 'any_value')

      const value = await sut.decrypt('any_token')

      expect(value).toEqual('any_value')
    })

    it('Should throw if verify throws', async () => {
      fakeJwt.verify.mockImplementationOnce(() => { throw new Error('verify_error') })

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrow(new Error('verify_error'))
    })
  })
})
