import { ValidationComposite } from '@/presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '@/presentation/helpers/validators/required-field-validation'
import { EmailValidation, Validation } from '@/presentation/helpers/validators'
import { EmailValidator } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/login'

jest.mock('@/presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenLastCalledWith(validations)
  })
})
