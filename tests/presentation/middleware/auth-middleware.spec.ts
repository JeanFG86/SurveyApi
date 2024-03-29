import { forbidden, ok, serverError } from '@/presentation/helpers/http'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadAccountByToken } from '@/domain/usecases'

describe('Auth Middleware', () => {
  let sut: AuthMiddleware
  let fakeLoadAccountByToken: MockProxy<LoadAccountByToken>
  let fakeRequest: AuthMiddleware.Request
  let role: string
  beforeAll(() => {
    fakeLoadAccountByToken = mock()

    fakeLoadAccountByToken.load.mockResolvedValue({ id: 'valid_id' })

    fakeRequest = {
      accessToken: 'any_token'
    }
    role = 'any_role'
  })

  beforeEach(() => {
    sut = new AuthMiddleware(fakeLoadAccountByToken, role)
  })

  it('Should return 403 if no x-access-token exists in headers', async () => {
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const loadSpy = jest.spyOn(fakeLoadAccountByToken, 'load')
    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenCalledWith({ accessToken: 'any_token', role: role })
  })

  it('Should return 403 if LoadAccountByToken returns undefined', async () => {
    fakeLoadAccountByToken.load.mockResolvedValueOnce(undefined)
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  it('Should return 500 if LoadAccountByToken throws ', async () => {
    fakeLoadAccountByToken.load.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
