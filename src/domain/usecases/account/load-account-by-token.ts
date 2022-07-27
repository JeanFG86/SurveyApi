import { AccountModel } from '@/domain/models'

export namespace LoadAccountByToken{
  export type Input = {accessToken: string, role?: string}
}

export interface LoadAccountByToken{
  load: (input: LoadAccountByToken.Input) => Promise<AccountModel | undefined>
}
