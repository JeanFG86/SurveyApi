import { EmailValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator')

describe('EmailValidatorAdapter', () => {
  let sut: EmailValidatorAdapter
  let fakeValidator: jest.Mocked<typeof validator>

  beforeAll(() => {
    fakeValidator = validator as jest.Mocked<typeof validator>
    fakeValidator.isEmail.mockReturnValue(true)
  })

  beforeEach(() => {
    sut = new EmailValidatorAdapter()
  })

  it('Should return false if validator return false', () => {
    fakeValidator.isEmail.mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBeFalsy()
  })

  it('Should return true if validator return true', () => {
    const isValid = sut.isValid('valid_email@mail.com')

    expect(isValid).toBeTruthy()
  })

  it('Should call validator with correct email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
