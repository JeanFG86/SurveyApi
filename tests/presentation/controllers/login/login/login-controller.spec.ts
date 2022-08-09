import { Authentication } from '@/domain/usecases'
import { LoginController } from '@/presentation/controllers/login/login'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http'
import { Validation, HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Login Controller', () => {
  let sut: LoginController
  let fakeValidation: MockProxy<Validation>
  let fakeRequest: MockProxy<HttpRequest>
  let fakeAuthentication: MockProxy<Authentication>
  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
    fakeAuthentication = mock()
    fakeRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    fakeAuthentication.auth.mockResolvedValue({ accessToken: 'any_token', name: 'any_name' })
  })

  beforeEach(() => {
    sut = new LoginController(fakeAuthentication, fakeValidation)
  })

  it('Should call Authentication with correct values', async () => {
    const authSpy = jest.spyOn(fakeAuthentication, 'auth')

    await sut.handle(fakeRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    fakeAuthentication.auth.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentications throws', async () => {
    jest.spyOn(fakeAuthentication, 'auth').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token', name: 'any_name' }))
  })

  it('should call Validation with correct values', async () => {
    const validateSpy = jest.spyOn(fakeValidation, 'validate')

    await sut.handle(fakeRequest)
    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  it('should return 400 if validation fails', async () => {
    fakeValidation.validate.mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
