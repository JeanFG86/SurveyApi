import { Authentication } from '@/domain/usecases'
import { LoginController } from '@/presentation/controllers/login'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'
import { EmailValidator, HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Login Controller', () => {
  let sut: LoginController
  let emailValidator: MockProxy<EmailValidator>
  let fakeRequest: MockProxy<HttpRequest>
  let fakeAuthentication: MockProxy<Authentication>
  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
    fakeAuthentication = mock()
    fakeRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    fakeAuthentication.auth.mockResolvedValue({ token: 'any_token' })
  })

  beforeEach(() => {
    sut = new LoginController(emailValidator, fakeAuthentication)
  })

  it('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    emailValidator.isValid.mockReturnValueOnce(false)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await sut.handle(fakeRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Authentication with correct values', async () => {
    const authSpy = jest.spyOn(fakeAuthentication, 'auth')

    await sut.handle(fakeRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })
})
