import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers/signup'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'
import { ok, serverError, badRequest } from '@/presentation/helpers'
import { Validation } from '@/presentation/helpers/validators'

describe('SignUp Controller', () => {
  let sut: SignUpController
  let fakeValidation: MockProxy<Validation>
  let addAccount: MockProxy<AddAccount>
  let fakeRequest: MockProxy<HttpRequest>
  let fakeAccount: MockProxy<AccountModel>
  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(undefined)
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
    sut = new SignUpController(addAccount, fakeValidation)
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

    expect(httpResponse).toEqual(ok(fakeAccount))
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
