import { EmailValidatorAdapter } from '@/utils'
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
})
