import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'

describe('RequiredField Validation', () => {
  let sut: RequiredFieldValidation

  beforeEach(() => {
    sut = new RequiredFieldValidation('field')
  })

  it('Should return a MissingParamError if validation fails', () => {
    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should not return if validation succeds', () => {
    const error = sut.validate({ field: 'any_name' })

    expect(error).toBeFalsy()
  })
})
