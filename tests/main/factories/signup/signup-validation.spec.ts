import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from '@/main/factories/signup'
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation'
import { CompareFieldsValidation, EmailValidation, Validation } from '@/presentation/helpers/validators'
import { EmailValidator } from '@/presentation/protocols'

jest.mock('@/presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})
