export namespace LoadAccountByTokenRepository{
  export type Input = {accessToken: string, role?: string}
  export type Result = {id: string} | null
}

export interface LoadAccountByTokenRepository{
  loadByToken: (input: LoadAccountByTokenRepository.Input) => Promise<LoadAccountByTokenRepository.Result>
}
