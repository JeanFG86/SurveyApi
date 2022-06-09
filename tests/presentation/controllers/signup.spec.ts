import { AddAccount } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers'
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('SignUp Controller', () => {
  let sut: SignUpController
  let emailValidator: MockProxy<EmailValidator>
  let addAccount: MockProxy<AddAccount>
  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
    addAccount = mock()
    addAccount.add.mockReturnValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  beforeEach(() => {
    sut = new SignUpController(emailValidator, addAccount)
  })

  it('should return 400 if no name is provided', () => {
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no password confirmation is provided', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if no password confirmation is fails', () => {
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should return 400 if no an invalid email is provided', () => {
    emailValidator.isValid.mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should return 500 if email validator thows', async () => {
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })

  it('should return 500 if AddAccount thows', async () => {
    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse?.statusCode).toBe(500)
    expect(httpResponse?.body).toEqual(new ServerError())
  })

  it('should call AddAccount with correct values', () => {
    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
