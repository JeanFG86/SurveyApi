import { EmailValidator } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'
import { EmailValidation } from '@/presentation/helpers/validators'
import { InvalidParamError } from '@/presentation/errors'

describe('Email Validation', () => {
  let sut: EmailValidation
  let emailValidator: MockProxy<EmailValidator>

  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
  })

  beforeEach(() => {
    sut = new EmailValidation('email', emailValidator)
  })

  it('should return an error if EmailValidator returns false', () => {
    emailValidator.isValid.mockReturnValueOnce(false)

    const error = sut.validate({ email: 'any_email@mail.com' })

    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    sut.validate({ email: 'any_email@mail.com' })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('should throws if EmailValidator throws', async () => {
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
