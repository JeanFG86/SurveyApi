import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/presentation/helpers/validators'

describe('CompareFieldsValidation', () => {
  let sut: CompareFieldsValidation

  beforeEach(() => {
    sut = new CompareFieldsValidation('field', 'fieldToCompare')
  })

  it('Should return a InvalidParamError if validation fails', () => {
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value2'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should not return if validation succeds', () => {
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(error).toBeFalsy()
  })
})
