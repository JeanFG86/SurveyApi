import { MissingParamError } from '@/presentation/errors'
import { Validation, ValidationComposite } from '@/presentation/helpers/validators'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Validation Composite', () => {
  let sut: ValidationComposite
  let fakeValidation: MockProxy<Validation>

  beforeAll(() => {
    fakeValidation = mock()
    fakeValidation.validate.mockReturnValue(new MissingParamError('field'))
  })

  beforeEach(() => {
    sut = new ValidationComposite([fakeValidation])
  })
  it('Should return an error if any validation fails', () => {
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
