import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/helpers/validators'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
