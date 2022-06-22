import { LoginController } from '@/presentation/controllers/login'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { EmailValidator } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Login Controller', () => {
  let sut: LoginController
  let emailValidator: MockProxy<EmailValidator>
  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
  })

  beforeEach(() => {
    sut = new LoginController(emailValidator)
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

  it('Should call EmailValidator with correct email', async () => {
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
