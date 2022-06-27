import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/presentation/helpers/validators'

describe('RequiredField Validation', () => {
  let sut: RequiredFieldValidation

  beforeEach(() => {
    sut = new RequiredFieldValidation('field')
  })
  it('Should return a MissingParamError if validation fails', () => {
    const error = sut.validate({ name: 'any_name' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
