import { AccountModel } from '@/domain/models'

export namespace LoadAccountByTokenRepository{
  export type Input = {accessToken: string, role?: string}
}

export interface LoadAccountByTokenRepository{
  loadByToken: (input: LoadAccountByTokenRepository.Input) => Promise<AccountModel | null>
}
