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
})
