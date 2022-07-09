import { AccountModel } from '@/domain/models'
import { AddAccount, Authentication } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers/signup'
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http'

describe('SignUp Controller', () => {
  let sut: SignUpController
  let fakeValidation: MockProxy<Validation>
  let addAccount: MockProxy<AddAccount>
  let fakeRequest: MockProxy<HttpRequest>
  let fakeAccount: MockProxy<AccountModel>
  let fakeAuthentication: MockProxy<Authentication>
  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
    fakeAuthentication = mock()
    fakeAuthentication.auth.mockResolvedValue({ token: 'any_token' })
    addAccount = mock()
    fakeAccount = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    addAccount.add.mockResolvedValue(fakeAccount)
    fakeRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
  })

  beforeEach(() => {
    sut = new SignUpController(addAccount, fakeValidation, fakeAuthentication)
  })

  it('should return 500 if AddAccount thows', async () => {
    jest.spyOn(addAccount, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new ServerError(undefined)))
  })

  it('should call AddAccount with correct values', async () => {
    const addSpy = jest.spyOn(addAccount, 'add')

    await sut.handle(fakeRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
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

  it('Should call Authentication with correct values', async () => {
    const authSpy = jest.spyOn(fakeAuthentication, 'auth')

    await sut.handle(fakeRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  it('Should return 500 if Authentications throws', async () => {
    jest.spyOn(fakeAuthentication, 'auth').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should return 403 if AddAccount returns undefined', async () => {
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    addAccount.add.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })
})
