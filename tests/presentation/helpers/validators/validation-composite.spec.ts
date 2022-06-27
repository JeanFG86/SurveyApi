import { MissingParamError } from '@/presentation/errors'
import { Validation, ValidationComposite } from '@/presentation/helpers/validators'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Validation Composite', () => {
  let sut: ValidationComposite
  let fakeValidation1: MockProxy<Validation>
  let fakeValidation2: MockProxy<Validation>
  let validations: Validation[]

  beforeAll(() => {
    fakeValidation1 = mock()
    fakeValidation1.validate.mockReturnValue(undefined)
    fakeValidation2 = mock()
    fakeValidation2.validate.mockReturnValue(undefined)
    validations = [fakeValidation1, fakeValidation2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validations)
  })

  it('Should return undefined if all validators return undefined', () => {
    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeUndefined()
  })

  it('Should return an error if any validation fails', () => {
    fakeValidation1.validate.mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more then one validation fails', () => {
    fakeValidation1.validate.mockReturnValueOnce(new MissingParamError('field'))
    fakeValidation2.validate.mockReturnValueOnce(new MissingParamError('field2'))
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
