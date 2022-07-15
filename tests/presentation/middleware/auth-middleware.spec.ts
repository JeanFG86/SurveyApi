import { forbidden } from '@/presentation/helpers/http'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadAccountByToken } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'

describe('Auth Middleware', () => {
  let sut: AuthMiddleware
  let fakeLoadAccountByToken: MockProxy<LoadAccountByToken>
  let fakeAccount: AccountModel
  beforeAll(() => {
    fakeLoadAccountByToken = mock()
    fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }
    fakeLoadAccountByToken.load.mockResolvedValue(fakeAccount)
  })

  beforeEach(() => {
    sut = new AuthMiddleware(fakeLoadAccountByToken)
  })

  it('Should return 403 if no x-access-token exists in headers', async () => {
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const loadSpy = jest.spyOn(fakeLoadAccountByToken, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(loadSpy).toHaveBeenCalledWith({ accessToken: 'any_token' })
  })
})
