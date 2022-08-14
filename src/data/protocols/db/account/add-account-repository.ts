import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository{
  add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result | undefined>
}

export namespace AddAccountRepository{
  export type Params = AddAccount.Params
  export type Result = AccountModel
}
